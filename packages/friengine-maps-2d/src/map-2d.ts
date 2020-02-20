import { TileSetCollection } from "./tile-set-collection";
import { TileSet } from "./tile-set";
import { Vec2, vec2, rect } from "friengine-core";
import { Map2dLayer } from "./map-2d-layer";
import { TileStack, Tile } from "./tile-stack";

export enum DrawOrder {
    RIGHT_DOWN = "right down",
    LEFT_DOWN = "left down",
    RIGHT_UP = "right up",
    LEFT_UP = "left up",
}

export enum IterationOrder {
    Z_FIRST = "z first",
    Z_LAST = "z last",
}

export class Map2d<TResource> {
    private tileSets: TileSetCollection<TResource>;

    constructor(
        public dimensions: Vec2,
        public tileDimensions: Vec2,
        public layers: Map2dLayer[],
        tileSets: TileSet<TResource>[],
        public drawOrder = DrawOrder.RIGHT_DOWN,
    ) {
        this.tileSets = new TileSetCollection(tileSets);
    }

    public at(position: Vec2): TileStack<TResource>;
    public at(position: Vec2, layer: Map2dLayer | number): Tile<TResource>;
    public at(position: Vec2, arg2?: Map2dLayer | number): TileStack<TResource> | Tile<TResource> {
        if (typeof arg2 !== "undefined") {
            const z = typeof arg2 === "number" ? arg2 : this.layers.indexOf(arg2);
            const layer = typeof arg2 === "number" ? this.layers[arg2] : arg2;
            if (!layer || !this.layers.includes(layer)) {
                throw new Error("Unknown layer.");
            }
            if (!rect(vec2(0, 0), this.dimensions).contains(position)) {
                throw new Error("Position out of range.");
            }
            const tileId = layer.tileTypeIdAt(position);
            const tileType = tileId === 0 ? undefined : this.tileSets.byId(tileId);
            if (!tileType && tileId !== 0) {
                throw new Error(`Layer has tile with invalid tile type id (${tileId}).`);
            }
            return { tileType, objects: layer.objectsWithin(position), position, z };
        }
        return new TileStack(this.layers.map(layer => this.at(position, layer)));
    }

    public *positionIterator(): Generator<Vec2> {
        switch (this.drawOrder) {
            case DrawOrder.LEFT_DOWN:
                for (let y = 0; y < this.dimensions.y; y++) {
                    for (let x = this.dimensions.x - 1; x >= 0; --x) {
                        yield vec2(x, y);
                    }
                }
                break;
            case DrawOrder.RIGHT_DOWN:
                for (let y = 0; y < this.dimensions.y; y++) {
                    for (let x = 0; x < this.dimensions.x; ++x) {
                        yield vec2(x, y);
                    }
                }
                break;
            case DrawOrder.LEFT_UP:
                for (let y = this.dimensions.y - 1; y >= 0; y--) {
                    for (let x = this.dimensions.x - 1; x >= 0; --x) {
                        yield vec2(x, y);
                    }
                }
                break;
            case DrawOrder.RIGHT_UP:
                for (let y = this.dimensions.y - 1; y >= 0; y--) {
                    for (let x = 0; x < this.dimensions.x; ++x) {
                        yield vec2(x, y);
                    }
                }
                break;
        }
    }

    public *tiles(iterationOrder = IterationOrder.Z_LAST): Generator<Tile<TResource>> {
        switch (iterationOrder) {
            case IterationOrder.Z_LAST:
                for (let z = 0; z < this.layers.length; ++z) {
                    for (const position of this.positionIterator()) {
                        yield this.at(position, z);
                    }
                }
                break;
            case IterationOrder.Z_FIRST:
                for (const position of this.positionIterator()) {
                    for (let z = 0; z < this.layers.length; ++z) {
                        yield this.at(position, z);
                    }
                }
                break;
        }
    }
}
