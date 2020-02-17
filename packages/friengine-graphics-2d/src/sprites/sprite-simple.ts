import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";
import { ResourceHandle } from "friengine-core";

export class SpriteSimple<TResource> extends Sprite<TResource> {
    constructor(protected handle: ResourceHandle<TResource>) {
        super();
    }

    public draw(target: ResourceDrawer2d<TResource>, options: SpriteDrawOptions): void {
        const { handle } = this;
        target.drawResource({
            handle,
            ...options,
        });
    }
}