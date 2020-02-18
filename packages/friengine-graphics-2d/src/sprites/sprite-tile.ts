import { SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle, Rect } from "friengine-core";
import { SpriteSimple } from "./sprite-simple";
import { getSourceSubRect, getDestinationCoordinates } from "./utils";

export class SpriteTile<TResource> extends SpriteSimple<TResource> {
    constructor(handle: ResourceHandle<TResource>, protected subRect: Rect) {
        super(handle);
    }

    public draw(target: ResourceDrawer2d<TResource>, { src: inputSrc, dest: inputDest, ...options }: SpriteDrawOptions): void {
        const src = getSourceSubRect(this.subRect, inputSrc);
        const dest = getDestinationCoordinates(src, inputDest);
        super.draw(target, { ...options, src, dest });
    }
}