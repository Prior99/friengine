import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle, Vec2 } from "friengine-core";
import { Atlas } from "friengine-atlas";

export interface SpriteAnimatedDrawOptions extends SpriteDrawOptions {
    time: number;
    animationName: string;
}

export class SpriteAnimated<TResource> extends Sprite<TResource> {
    constructor(protected handle: ResourceHandle<TResource>, public atlas: Atlas) {
        super();
    }

    public draw(
        target: ResourceDrawer2d<TResource>,
        { animationName, time, src: inputSrc, ...options }: SpriteAnimatedDrawOptions,
    ): void {
        const { handle } = this;
        const frame = this.atlas.frame(animationName, time);
        if (!frame) {
            throw new Error(`Unknown animation "${animationName}"`);
        }
        const src = !inputSrc
            ? frame.rect
            : Vec2.isVec2(inputSrc)
            ? frame.rect.offset(inputSrc)
            : frame.rect.subRect(inputSrc);
        target.drawResource({
            handle,
            ...options,
            src,
        });
    }
}
