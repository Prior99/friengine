import { Sprite, SpriteDrawOptions } from "./sprite";
import { ResourceDrawer2d } from "../resource-drawer-2d";

export class SpriteSimple<TResource> extends Sprite<TResource> {
    public draw(target: ResourceDrawer2d<TResource>, options: SpriteDrawOptions): void {
        const { handle } = this;
        target.drawResource({
            handle,
            ...options,
        });
    }
}