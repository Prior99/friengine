import { ResourceDrawer2d } from "../resource-drawer-2d";
import { Vec2, Rect } from "friengine-core";

export interface SpriteDrawOptions {
    src?: Vec2 | Rect;
    dest: Vec2 | Rect;
}

export abstract class Sprite<TResource, TOptions extends SpriteDrawOptions = SpriteDrawOptions> {
    public abstract draw(target: ResourceDrawer2d<TResource>, options: TOptions): void;
}