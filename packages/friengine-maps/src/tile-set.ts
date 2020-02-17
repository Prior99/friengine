import { Vec2 } from "friengine-core";
import { TileType } from "./tile-type";

export abstract class TileSet<TResource> {
    public tileTypes = new Map<number, TileType<TResource>>();

    constructor(public name: string, public tileDimensions: Vec2, tiles: TileType<TResource>[]) {
        tiles.forEach(tile => this.tileTypes.set(tile.id, tile));
    }

    public get count(): number {
        return this.tileTypes.size;
    }

    public byId(id: number): TileType<TResource> | undefined {
        return this.tileTypes.get(id);
    }
}
