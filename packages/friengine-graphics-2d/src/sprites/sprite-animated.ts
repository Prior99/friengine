import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle } from "friengine-core/src";

export interface SpriteAnimatedOptions extends SpriteDrawOptions {
    time: number;
    animationName: string;
}

export class SpriteAnimated<TResource> extends Sprite<TResource> {
    constructor(protected handle: ResourceHandle<TResource>, public atlas: {}) {
        super();
    }

    public draw(target: ResourceDrawer2d<TResource>, options: SpriteAnimatedOptions): void {
        const { handle } = this;
        target.drawResource({
            handle,
            ...options,
        });
    }
}