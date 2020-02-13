import { ResourceManager, ResourceHandle, SpecificResourceManager, Resource } from "friengine-core";
import { TextureManager } from "friengine-graphics";
import { Sprite } from "./sprite";

export const RESOURCE_TYPE_SPRITE = Symbol("ResourceTypeSprite");

export interface SpriteLoadOptions {
    url: string;
}

export class SpriteManager<TResource> extends SpecificResourceManager<SpriteLoadOptions, Sprite<TResource>> {

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_SPRITE);
    }

    protected readonly resourceType = RESOURCE_TYPE_SPRITE;

    constructor(
        resourceManager: ResourceManager,
        private textureManager: TextureManager,
    ) {
        super(resourceManager);
    }

    protected async loader(_options: SpriteLoadOptions): Promise<Sprite<TResource>> {
        throw new Error("Not implemented.");
    }

    public load(_handle: ResourceHandle<Sprite<TResource>>): Resource<Sprite<TResource>> {
        throw new Error("Not implemented.");
    }
}
