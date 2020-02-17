import { Rect } from "friengine-core";

export abstract class MapLayer {
    constructor(public area: Rect, public zIndex?: number) {}
}