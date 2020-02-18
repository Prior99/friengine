import { Map2dObject } from "./map-2d-layer";
import { TileType } from "./tile-set";
import { Vec2 } from "friengine-core";

export interface Tile<TResource> {
    tileType: TileType<TResource> | undefined;
    objects: Map2dObject[];
    position: Vec2;
    z: number;
}

export class TileStack<TResource> {
    constructor(public tiles: Tile<TResource>[]) {}

    public allObjects(): Map2dObject[] {
        return this.tiles.reduce((result, tile) => {
            result.push(...tile.objects);
            return result;
        }, [] as Map2dObject[]);
    }
}