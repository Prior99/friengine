import { Tile } from "./tile";
import { MapObject } from "./map-layer";

export class TileStack<TResource> {
    constructor(public tiles: Tile<TResource>[]) {}

    public allObjects(): MapObject[] {
        return this.tiles.reduce((result, tile) => {
            result.push(...tile.objects);
            return result;
        }, []);
    }
}