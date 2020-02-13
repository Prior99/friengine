import { ResourceHandle, Vec2, Rect } from "friengine-core";

export interface ResourceDrawOptions2d<TResource> {
    handle: ResourceHandle<TResource>;
    src?: Vec2 | Rect;
    dest: Vec2 | Rect;
}

export interface ResourceDrawer2d<TResource> {
    drawResource(options: ResourceDrawOptions2d<TResource>): void;
}