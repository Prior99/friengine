import {
    ResourceManager,
    ResourceHandle,
    BaseSpecificResourceManager,
    LoadResultStatus,
    LoadResult,
} from "friengine-core";

export interface JsonLoadOptions {
    url: string;
}

export interface JsonManagerOptions {
    fetch?: typeof fetch,
}

export const RESOURCE_TYPE_JSON = Symbol("ResourceTypeJson");

export class JsonManager extends BaseSpecificResourceManager<JsonLoadOptions, unknown> {
    static add(url: string): ResourceHandle<unknown> {
        return ResourceManager.add({
            type: RESOURCE_TYPE_JSON,
            options: { url },
        });
    }

    static get allHandles(): ResourceHandle<unknown>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_JSON);
    }

    protected readonly resourceType = RESOURCE_TYPE_JSON;

    constructor(resourceManager: ResourceManager, private options: JsonManagerOptions = {}) {
        super(resourceManager);
    }

    private get fetch(): typeof fetch {
        return this.options.fetch ?? window.fetch;
    }

    protected async loader({ url }: JsonLoadOptions): Promise<LoadResult<unknown>> {
        const response = await this.fetch(url);
        const data: unknown = await response.json();
        return {
            status: LoadResultStatus.SUCCESS,
            data,
        };
    }
}
