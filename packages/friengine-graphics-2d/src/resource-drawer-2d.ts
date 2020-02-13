import { ResourceHandle, Vec2 } from "friengine-core";

export interface ResourceDrawOptions2d<TResource> {
    handle: ResourceHandle<TResource>;
    srcPosition?: Vec2;
    destPosition: Vec2;
    srcDimensions?: Vec2;
    destDimensions?: Vec2;
}

export interface ResourceDrawer2d<TResource> {
    drawResource(options: ResourceDrawOptions2d<TResource>): void;
}