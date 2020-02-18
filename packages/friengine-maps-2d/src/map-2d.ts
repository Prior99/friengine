import { TileSetCollection } from "./tile-set-collection";
import { TileSet, TileType } from "./tile-set";
import { Vec2 } from "friengine-core";
import { Map2dLayer, Map2dObject } from "./map-2d-layer";
import { TileStack } from "./tile-stack";

export interface Tile<TResource> {
    tileType: TileType<TResource>;
    objects: Map2dObject[];
}

export enum DrawOrder {
    RIGHT_DOWN = "right down",
    LEFT_DOWN = "left down",
    RIGHT_UP = "right up",
    LEFT_UP = "left up",
}

export class Map2d<TResource> {
    private tileSets: TileSetCollection<TResource>;

    constructor(
        public dimensions: Vec2,
        private layers: Map2dLayer[],
        tileSets: TileSet<TResource>[],
        public drawOrder = DrawOrder.RIGHT_DOWN,
    ) {
        this.tileSets = new TileSetCollection(tileSets);
    }

    public at(position: Vec2): TileStack<TResource>;
    public at(position: Vec2, layer: Map2dLayer | number): Tile<TResource>;
    public at(position: Vec2, arg2?: Map2dLayer | number): TileStack<TResource> | Tile<TResource> {
        if (typeof arg2 !== "undefined") {
            const layer = typeof arg2 === "number" ? this.layers[arg2] : arg2;
            if (!layer || !this.layers.includes(layer)) {
                throw new Error("Unknown layer.");
            }
            const tileType = this.tileSets.byId(layer.tileTypeIdAt(position));
            if (!tileType) {
                throw new Error("Layer has tile with invalid tile type id.");
            }
            return { tileType, objects: layer.objectsWithin(position) };
        }
        return new TileStack(this.layers.map(layer => this.at(position, layer)));
    }
}
