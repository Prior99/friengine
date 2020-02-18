import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle } from "friengine-core";
import { Atlas } from "friengine-atlas";
import { getSourceSubRect, getDestinationCoordinates } from "./utils";

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
        { animationName, time, src: inputSrc, dest: inputDest, ...options }: SpriteAnimatedDrawOptions,
    ): void {
        const { handle } = this;
        const frame = this.atlas.frame(animationName, time);
        if (!frame) {
            throw new Error(`Unknown animation "${animationName}"`);
        }
        const src = getSourceSubRect(frame.rect, inputSrc);
        const dest = getDestinationCoordinates(src, inputDest);
        target.drawResource({ handle, ...options, src, dest });
    }
}
