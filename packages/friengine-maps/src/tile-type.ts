import { ResourceHandle } from "friengine-core";
import { SpriteSimple } from "friengine-graphics-2d";

export class TileType<TResource> {
    constructor(public id: number, public spriteHandle: ResourceHandle<SpriteSimple<TResource>>) {}
}