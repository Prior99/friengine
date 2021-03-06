import {
    ResourceManager,
    ResourceLoader,
} from "./resource-manager";
import { Constructable } from "./types";
import { ResourceHandle } from "./resource-handle";
import { Resource, DoneResource } from "./resource";
import { LoadResult } from "./load-result";

export interface SpecificResourceManagerConfig<TData, TOptions> {
    superClass: Constructable<BaseSpecificResourceManager<TData, TOptions>, [ResourceManager]>;
    add: (args: Omit<ResourceLoader<TOptions>, "type">) => ResourceHandle<TData>;
    allHandles: () => ResourceHandle<TData>[];
}

export interface SpecificResourceManager<TData> {
    waitUntilFinished(): Promise<DoneResource<TData>[]>;
    get(resourceHandle: ResourceHandle<TData>): TData;
    getResource(resourceHandle: ResourceHandle<TData>): Resource<TData>;
    load(handle: ResourceHandle<TData>): Resource<TData>;
    loadAll(): Resource<TData>[];
    isKnownHandle(handle: ResourceHandle<unknown>): handle is ResourceHandle<TData>;
    loadAllKnownHandles(handles: ResourceHandle<unknown>[]): Resource<TData>[];
}

export abstract class BaseSpecificResourceManager<TOptions, TData, TMeta = {}> implements SpecificResourceManager<TData>{
    protected meta = new Map<symbol, TMeta>();

    constructor(public resourceManager: ResourceManager) {}

    public async waitUntilFinished(): Promise<DoneResource<TData>[]> {
        return await Promise.all(
            this.resourceManager
                .search({ type: this.resourceType })
                .map(resource => this.resourceManager.waitFor(resource as Resource<TData>)),
        );
    }

    protected abstract loader(options: TOptions, handle: ResourceHandle<TData>): Promise<LoadResult<TData>>;
    protected readonly abstract resourceType: symbol;

    public get<T extends TData>(resourceHandle: ResourceHandle<T>): T {
        return this.resourceManager.get(resourceHandle);
    }

    public getResource<T extends TData>(resourceHandle: ResourceHandle<T>): Resource<T> {
        return this.resourceManager.getResource(resourceHandle);
    }

    public load(handle: ResourceHandle<TData>): Resource<TData> {
        return this.resourceManager.load(handle, (options: TOptions) => this.loader(options, handle));
    }

    public loadAll(): Resource<TData>[] {
        return ResourceManager.getHandlesForType(this.resourceType).map(handle => this.load(handle)) as Resource<TData>[];
    }

    public isKnownHandle(handle: ResourceHandle<unknown>): handle is ResourceHandle<TData> {
        return ResourceManager.getHandlesForType(this.resourceType)
            .map(({ symbol }) => symbol)
            .includes(handle.symbol);
    }

    public loadAllKnownHandles(handles: ResourceHandle<unknown>[]): Resource<TData>[] {
        const knownHandles: ResourceHandle<TData>[] = handles.filter(handle => this.isKnownHandle(handle));
        return knownHandles.map(handle => this.load(handle));
    }
}
