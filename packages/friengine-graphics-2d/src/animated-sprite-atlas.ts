import { ResourceHandle } from "friengine-core/src";

export interface AnimatedSpriteAtlasFrame<TResource> {
    handle: ResourceHandle<TResource>

}

export interface AnimatedSpriteAtlas<TResource> {
    frames: AnimatedSpriteAtlasFrame<TResource>[];

}