import { ResourceManager, DoneResource, ResourceHandle, LoaderFunction, Resource, ResourceLoader } from "./resource-manager";
import { Constructable } from "./types";

export interface SpecificResourceManager<TData, TOptions> {
    resourceManager: ResourceManager;
    waitUntilFinished(): Promise<DoneResource<TData>[]>;
    get(resourceHandle: ResourceHandle<TData>): TData;
    getResource(resourceHandle: ResourceHandle<TData>): Resource<TData>;
    load(handle: ResourceHandle<TData>, load: LoaderFunction<TOptions, TData>): Resource<TData>;
    loadAll(load: LoaderFunction<TOptions, TData>): Promise<DoneResource<TData>[]>;
}

export interface SpecificResourceManagerConfig<TData, TOptions> {
    superClass: Constructable<SpecificResourceManager<TData, TOptions>, [ResourceManager]>;
    add: (args: Omit<ResourceLoader<TOptions>, "type">) => ResourceHandle<TData>;
    allHandles: () => ResourceHandle<TData>[];
}

// eslint-disable-next-line
export function createSpecificResourceManager<TData, TOptions>(
    resourceType: symbol,
): SpecificResourceManagerConfig<TData, TOptions> {
    function add(args: Omit<ResourceLoader<TOptions>, "type">): ResourceHandle<TData> {
        return ResourceManager.add({ ...args, type: resourceType });
    }

    function allHandles(): ResourceHandle<TData>[] {
        return ResourceManager.getHandlesForType(resourceType);
    }

    class InternalSpecificResourceManager implements SpecificResourceManager<TData, TOptions> {
        constructor(public resourceManager: ResourceManager) {}

        public async waitUntilFinished(): Promise<DoneResource<TData>[]> {
            return await Promise.all(
                this.resourceManager
                    .search({ type: resourceType })
                    .map(resource => this.resourceManager.waitFor(resource as Resource<TData>)),
            );
        }

        public get(resourceHandle: ResourceHandle<TData>): TData {
            return this.resourceManager.get(resourceHandle);
        }

        public getResource(resourceHandle: ResourceHandle<TData>): Resource<TData> {
            return this.resourceManager.getResource(resourceHandle);
        }

        public load(handle: ResourceHandle<TData>, load: LoaderFunction<TOptions, TData>): Resource<TData> {
            return this.resourceManager.load(handle, load);
        }

        public async loadAll(load: LoaderFunction<TOptions, TData>): Promise<DoneResource<TData>[]> {
            const resources = allHandles().map(handle => this.load(handle, load)) as Resource<TData>[];
            return await Promise.all(resources.map(resource => this.resourceManager.waitFor(resource)));
        }
    }

    return {
        add,
        allHandles,
        superClass: InternalSpecificResourceManager,
    };
}
