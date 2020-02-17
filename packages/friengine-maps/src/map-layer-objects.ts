import { MapLayer } from "./map-layer";
import { MapObject } from "./map-object";
import { Rect } from "friengine-core";

export class MapLayerObjects extends MapLayer {
    constructor(area: Rect, public objects: MapObject[] = [], zIndex?: number) {
        super(area, zIndex);
    }
}