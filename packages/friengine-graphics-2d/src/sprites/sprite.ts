import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle, Vec2 } from "friengine-core";

export interface SpriteDrawOptions {
    srcPosition?: Vec2;
    destPosition: Vec2;
    srcDimensions?: Vec2;
    destDimensions?: Vec2;
}

export abstract class Sprite<TResource, TOptions extends SpriteDrawOptions = SpriteDrawOptions> {
    constructor(protected handle: ResourceHandle<TResource>) {}

    public abstract draw(target: ResourceDrawer2d<TResource>, options: TOptions): void;
}