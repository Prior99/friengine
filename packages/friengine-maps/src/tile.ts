import { TileType } from "./tile-type";
import { MapObject } from "./map-object";

export class Tile<TResource> {
    constructor(public type: TileType<TResource>, public objects: MapObject[]) {};
}