import { MapLayer } from "./map-layer";
import { Rect } from "friengine-core";

export class MapLayerTiles extends MapLayer {
    constructor(area: Rect, public data: number[], zIndex?: number) {
        super(area, zIndex);
    }
}