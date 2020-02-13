import {
    ResourceManager,
    ResourceHandle,
    BaseSpecificResourceManager,
    Resource,
    SpecificResourceManager,
    LoadResult,
} from "friengine-core";
import { Sprite } from "./sprite";

export const RESOURCE_TYPE_SPRITE = Symbol("ResourceTypeSprite");

export interface SpriteLoadOptions {
    url: string;
}

export class SpriteManager<TResource> extends BaseSpecificResourceManager<SpriteLoadOptions, Sprite<TResource>> {
    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_SPRITE);
    }

    protected readonly resourceType = RESOURCE_TYPE_SPRITE;

    constructor(resourceManager: ResourceManager, private drawableManager: SpecificResourceManager<TResource>) {
        super(resourceManager);
    }

    protected async loader(_options: SpriteLoadOptions): Promise<LoadResult<Sprite<TResource>>> {
        throw new Error("Not implemented.");
    }

    public load(_handle: ResourceHandle<Sprite<TResource>>): Resource<Sprite<TResource>> {
        throw new Error("Not implemented.");
    }
}
