import { Vec2, ResourceHandle } from "friengine-core";
import { SpriteSimple } from "friengine-graphics-2d";

export interface TileType<TResource> {
    id: number;
    spriteHandle: ResourceHandle<SpriteSimple<TResource>>;
    dimensions: Vec2;
}

export class TileSet<TResource> {
    public tileTypes = new Map<number, TileType<TResource>>();

    constructor(public name: string, tiles: TileType<TResource>[]) {
        tiles.forEach(tile => {
            if (tile.id === 0) {
                throw new Error("Invalid tile id (can't be 0).");
            }
            this.tileTypes.set(tile.id, tile);
        });
    }

    public get count(): number {
        return this.tileTypes.size;
    }

    public get upperLimit(): number {
        return Math.max(...Array.from(this.tileTypes.keys())) + 1;
    }

    public byId(id: number): TileType<TResource> | undefined {
        return this.tileTypes.get(id);
    }
}
