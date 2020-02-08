import { Constructable } from "./types";
import { numericalId } from "./utils";

export enum LoadStatus {
    PENDING = "pending",
    IN_PROGRESS = "in progress",
    DONE = "done",
    ERROR = "error",
}

export interface BaseResource<T> {
    loader: ResourceLoader<T>;
    status: LoadStatus;
    type: Symbol;
    id: number;
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
    load: () => Promise<T>;
}

export interface ResourceListener<T> {
    resolve: (resource: DoneResource<T>) => void;
    reject: (error: Error) => void;
}

export interface ResourceSearchOptions {
    status?: LoadStatus;
    anyStatus?: LoadStatus[];
    type?: Symbol;
}

export class ResourceManager {
    private resources = new Map<number, Resource<unknown>>();
    private listeners = new Map<number, ResourceListener<unknown>[]>();

    constructor(private parallel = 4) { }

    public add<T>(type: Symbol, loader: ResourceLoader<T>): Resource<T> {
        const id = numericalId();
        const resource: Resource<T> = {
            loader,
            status: LoadStatus.PENDING,
            type,
            id,
        };
        this.resources.set(id, resource);
        this.fillQueue();
        return resource;
    }

    public waitFor<T>(id: number): Promise<DoneResource<T>> {
        return new Promise((resolve, reject) => {
            if (!this.resources.has(id)) {
                reject(new Error("Can't wait for unknown resource"));
                return;
            }
            const listener = { resolve, reject } as ResourceListener<unknown>;
            const listeners = this.listeners.get(id);
            if (listeners) {
                listeners.push(listener);
                return;
            }
            this.listeners.set(id, [listener]);
        });
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
            this.loadNext();
        }
    }

    private loadNext(): void {
        const resource = this.all.find(resource => resource.status === LoadStatus.PENDING);
        /* istanbul ignore if */
        if (!resource) {
            return;
        }
        resource.status = LoadStatus.IN_PROGRESS;
        this.load(resource);
    }

    private invokeResourceListeners(resource: Resource<unknown>) {
        const listeners = this.listeners.get(resource.id);
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
        this.listeners.delete(resource.id);
    }

    private async load(resource: Resource<unknown>): Promise<void> {
        try {
            const data = await resource.loader.load();
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

    public get done(): boolean {
        if (this.resources.size === 0) {
            return true;
        }
        return this.all.every(resource => [LoadStatus.DONE, LoadStatus.ERROR].includes(resource.status));
    }

    public doneForType(type: Symbol): boolean {
        if (this.resources.size === 0) {
            return true;
        }
        return this.search({ type, anyStatus: [LoadStatus.IN_PROGRESS, LoadStatus.PENDING] }).length === 0;
    }
}
