import { Constructable } from "./types";
import { numericalId } from "./utils";

export enum LoadStatus {
    PENDING = "pending",
    IN_PROGRESS = "in progress",
    DONE = "done",
    ERROR = "error",
}

export interface BaseResource<T> {
    load: () => Promise<T>;
    status: LoadStatus;
    type: symbol;
    symbol: symbol;
}

export interface DoneResource<T> extends BaseResource<T> {
    status: LoadStatus.DONE;
    data: T;
}

export interface ErrorResource<T> extends BaseResource<T> {
    status: LoadStatus.ERROR;
    error: Error;
}

export interface UnfinishedResource<T> extends BaseResource<T> {
    status: LoadStatus.PENDING | LoadStatus.IN_PROGRESS;
}

export type Resource<T> = DoneResource<T> | ErrorResource<T> | UnfinishedResource<T>;

export interface ResourceLoader<T> {
    type: symbol;
    load: () => Promise<T>;
}

export interface ResourceListener<T> {
    resolve: (resource: DoneResource<T>) => void;
    reject: (error: Error) => void;
}

export interface ResourceSearchOptions {
    status?: LoadStatus;
    anyStatus?: LoadStatus[];
    type?: symbol;
}

export interface ResourceHandle<T> {
    symbol: symbol;
}

export class ResourceManager {
    public static add<T>(loader: ResourceLoader<T>): ResourceHandle<T> {
        const handle = {
            symbol: Symbol(),
        };
        ResourceManager.registry.set(handle.symbol, loader);
        return handle;
    }

    public static reset(): void {
        ResourceManager.registry = new Map();
    }

    private static registry = new Map<symbol, ResourceLoader<unknown>>();

    private resources = new Map<symbol, Resource<unknown>>();
    private listeners = new Map<symbol, ResourceListener<unknown>[]>();

    constructor(private parallel = 4) {}

    public async loadAll(): Promise<void> {
        const resources = Array.from(ResourceManager.registry.keys()).map(symbol => this.load({ symbol }));
        await Promise.all(resources.map(resource => this.waitFor(resource)));
    }

    public get<T>(resourceHandle: ResourceHandle<T>): T {
        const resource = this.getResource(resourceHandle);
        if (resource.status !== LoadStatus.DONE) {
            throw new Error("Resource has not yet finished loading.");
        }
        return resource.data;
    }

    public getResource<T>(resourceHandle: ResourceHandle<T>): Resource<T> {
        const result = this.resources.get(resourceHandle.symbol);
        if (!result) {
            if (!ResourceManager.registry.has(resourceHandle.symbol)) {
                throw new Error("Not a resource handle.");
            }
            throw new Error("Resource handle not loaded in this instance.");
        }
        return result as Resource<T>;
    }

    public load<T>(handle: ResourceHandle<T>): Resource<T> {
        const { symbol } = handle;
        const resourceLoader = ResourceManager.registry.get(symbol);
        if (!resourceLoader) {
            throw new Error("Not a resource handle.");
        }
        const { load, type } = resourceLoader as ResourceLoader<T>;
        const resource: Resource<T> = {
            load,
            type,
            status: LoadStatus.PENDING,
            symbol,
        };
        this.resources.set(symbol, resource);
        this.fillQueue();
        return resource;
    }

    public waitFor<T>(resource: Resource<unknown>): Promise<DoneResource<T>> {
        return new Promise((resolve, reject) => {
            const { symbol } = resource;
            if (!this.resources.has(resource.symbol)) {
                reject(new Error("Can't wait for foreign resource"));
                return;
            }
            if (resource.status === LoadStatus.DONE) {
                resolve(resource as DoneResource<T>);
                return;
            }
            if (resource.status === LoadStatus.ERROR) {
                reject(resource.error);
                return;
            }
            const listener = { resolve, reject } as ResourceListener<unknown>;
            const listeners = this.listeners.get(symbol);
            if (listeners) {
                listeners.push(listener);
                return;
            }
            this.listeners.set(symbol, [listener]);
        });
    }

    public get done(): boolean {
        if (this.resources.size === 0) {
            return true;
        }
        return this.all.every(resource => [LoadStatus.DONE, LoadStatus.ERROR].includes(resource.status));
    }

    public doneForType(type: symbol): boolean {
        if (this.resources.size === 0) {
            return true;
        }
        return this.search({ type, anyStatus: [LoadStatus.IN_PROGRESS, LoadStatus.PENDING] }).length === 0;
    }

    private get all(): Resource<unknown>[] {
        return Array.from(this.resources.values());
    }

    public search({ status, anyStatus, type }: ResourceSearchOptions = {}): Resource<unknown>[] {
        return this.all
            .filter(resource => !status || resource.status === status)
            .filter(resource => !anyStatus || anyStatus.includes(resource.status))
            .filter(resource => !type || resource.type === type);
    }

    private fillQueue(): void {
        while (
            this.search({ status: LoadStatus.IN_PROGRESS }).length < this.parallel &&
            this.search({ status: LoadStatus.PENDING }).length !== 0
        ) {
            this.processNext();
        }
    }

    private processNext(): void {
        const resource = this.all.find(resource => resource.status === LoadStatus.PENDING);
        /* istanbul ignore if */
        if (!resource) {
            return;
        }
        resource.status = LoadStatus.IN_PROGRESS;
        this.process(resource);
    }

    private invokeResourceListeners(resource: Resource<unknown>): void {
        const listeners = this.listeners.get(resource.symbol);
        if (!listeners) {
            return;
        }
        switch (resource.status) {
            case LoadStatus.DONE: {
                listeners.forEach(listener => listener.resolve(resource));
                break;
            }
            case LoadStatus.ERROR: {
                listeners.forEach(listener => listener.reject(resource.error));
                break;
            }
        }
        this.listeners.delete(resource.symbol);
    }

    private async process(resource: Resource<unknown>): Promise<void> {
        try {
            const data = await resource.load();
            Object.assign(resource, {
                status: LoadStatus.DONE,
                data,
            });
        } catch (error) {
            Object.assign(resource, {
                status: LoadStatus.ERROR,
                error,
            });
        } finally {
            this.invokeResourceListeners(resource);
            this.fillQueue();
        }
    }
}
