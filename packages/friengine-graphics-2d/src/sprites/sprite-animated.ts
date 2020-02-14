import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle, Vec2, rect, Rect } from "friengine-core";
import { Atlas, Frame } from "friengine-atlas";

export interface SpriteAnimatedDrawOptions extends SpriteDrawOptions {
    time: number;
    animationName: string;
}

function getSourceCoordinates(frame: Frame, src: Vec2 | Rect | undefined): Rect {
    if (!src) {
        return frame.rect;
    }
    if (Vec2.isVec2(src)) {
        return frame.rect.subRect(rect(src, frame.rect.dimensions));
    }
    return frame.rect.subRect(src);
}

function getDestinationCoordinates(src: Rect, dest: Vec2 | Rect): Rect {
    if (Vec2.isVec2(dest)) {
        return rect(dest, src.dimensions);
    }
    return dest;
}

export class SpriteAnimated<TResource> extends Sprite<TResource> {
    constructor(protected handle: ResourceHandle<TResource>, public atlas: Atlas) {
        super();
    }

    public draw(
        target: ResourceDrawer2d<TResource>,
        { animationName, time, src: inputSrc, dest: inputDest, ...options }: SpriteAnimatedDrawOptions,
    ): void {
        const { handle } = this;
        const frame = this.atlas.frame(animationName, time);
        if (!frame) {
            throw new Error(`Unknown animation "${animationName}"`);
        }
        const src = getSourceCoordinates(frame, inputSrc);
        const dest = getDestinationCoordinates(src, inputDest);
        target.drawResource({
            handle,
            ...options,
            src,
            dest,
        });
    }
}
