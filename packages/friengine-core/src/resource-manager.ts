import { logger } from "./utils";
import { ResourceHandle } from "./resource-handle";
import { LoadStatus, Resource, DoneResource, UnfinishedResource } from "./resource";
import { LoadResultStatus, LoadResult } from "./load-result";

export interface ResourceLoader<T> {
    type: symbol;
    options: T;
    dependencies?: ResourceHandle<unknown>[];
}

export type LoaderFunction<TOptions, TResource> = (options: TOptions) => Promise<LoadResult<TResource>>;

export interface ResourceListener<T> {
    resolve: (resource: DoneResource<T>) => void;
    reject: (error: Error) => void;
}

export interface ResourceSearchOptions {
    status?: LoadStatus;
    anyStatus?: LoadStatus[];
    type?: symbol;
    filter?: (resource: Resource<unknown>, index: number) => boolean;
}

export class ResourceManager {
    public static add<T>(loader: ResourceLoader<T>): ResourceHandle<T> {
        logger.debug("Added new resource handle.");
        const handle = {
            symbol: Symbol(),
        };
        ResourceManager.registry.set(handle.symbol, loader);
        return handle;
    }

    public static getHandlesForType<T>(type: symbol): ResourceHandle<T>[] {
        return Array.from(ResourceManager.registry.entries())
            .filter(([_symbol, value]) => value.type === type)
            .map(([symbol]) => ({ symbol }));
    }

    public static reset(): void {
        ResourceManager.registry = new Map();
    }

    private static registry = new Map<symbol, ResourceLoader<unknown>>();

    private resources = new Map<symbol, Resource<unknown>>();
    private listeners = new Map<symbol, ResourceListener<unknown>[]>();

    constructor(private parallel = 4) {}

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

    public load<T, U>(handle: ResourceHandle<T>, load: LoaderFunction<U, T>): Resource<T> {
        const { symbol } = handle;
        const resourceLoader = ResourceManager.registry.get(symbol);
        if (!resourceLoader) {
            throw new Error("Not a resource handle.");
        }
        const { options, type, dependencies = [] } = resourceLoader as ResourceLoader<U>;
        const resource: Resource<T> = {
            load: () => load(options),
            type,
            status: LoadStatus.PENDING,
            symbol,
            dependencies,
        };
        this.resources.set(symbol, resource);
        this.fillQueue();
        return resource;
    }

    public waitFor<T>(resource: Resource<T>): Promise<DoneResource<T>> {
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

    public async waitUntilFinished(): Promise<DoneResource<unknown>[]> {
        return await Promise.all(this.all.map(resource => this.waitFor(resource as Resource<unknown>)));
    }

    private get all(): Resource<unknown>[] {
        return Array.from(this.resources.values());
    }

    public search({ status, anyStatus, type, filter }: ResourceSearchOptions = {}): Resource<unknown>[] {
        return this.all
            .filter(resource => !status || resource.status === status)
            .filter(resource => !anyStatus || anyStatus.includes(resource.status))
            .filter(resource => !type || resource.type === type)
            .filter((resource, index) => !filter || filter(resource, index));
    }

    public knowsHandle(handle: ResourceHandle<unknown>): boolean {
        return this.resources.has(handle.symbol);
    }

    private get processableResources(): UnfinishedResource<unknown>[] {
        return this.search({ filter: resource => this.isResourceLoadable(resource) }) as UnfinishedResource<unknown>[];
    }

    public resourceDone(handle: ResourceHandle<unknown>): boolean {
        return this.getResource(handle).status === LoadStatus.DONE;
    }

    public isResourceLoadable(resource: Resource<unknown>): boolean {
        if (resource.status !== LoadStatus.PENDING) {
            return false;
        }
        return (
            resource.dependencies.length === 0 ||
            resource.dependencies.every(handle => {
                if (!this.knowsHandle(handle)) {
                    return false;
                }
                return this.getResource(handle).status === LoadStatus.DONE;
            })
        );
    }

    private get isBusy(): boolean {
        return this.search({ status: LoadStatus.IN_PROGRESS }).length < this.parallel;
    }

    private fillQueue(): void {
        while (this.isBusy && this.processableResources.length > 0) {
            this.processNext();
        }
        if (this.processableResources.length > 0 && !this.isBusy) {
            logger.debug("Out of processable resources, but not all resources have been loaded.");
        }
    }

    private processNext(): void {
        const resource = this.all.find(resource => this.isResourceLoadable(resource));
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
            const result: LoadResult<unknown> = await resource.load();
            switch (result.status) {
                case LoadResultStatus.ERROR:
                    throw result.error;
                case LoadResultStatus.SUCCESS:
                    Object.assign(resource, {
                        status: LoadStatus.DONE,
                        data: result.data,
                    });
                    this.invokeResourceListeners(resource);
                    break;
                case LoadResultStatus.DEFERRED:
                    resource.dependencies.push(
                        ...result.dependencies.filter(
                            ({ symbol }) => !resource.dependencies.some(existing => existing.symbol === symbol),
                        ),
                    );
                    resource.status = LoadStatus.PENDING;
                    break;
            }
        } catch (error) {
            Object.assign(resource, {
                status: LoadStatus.ERROR,
                error,
            });
            this.invokeResourceListeners(resource);
        } finally {
            this.fillQueue();
        }
    }
}
