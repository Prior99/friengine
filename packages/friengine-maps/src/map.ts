import { MapLayer } from "./map-layer";
import { TileSetCollection } from "./tile-set-collection";
import { TileSet } from "./tile-set";
import { Vec2, Constructable } from "friengine-core";
import { Tile } from "./tile";
import { ZGroups, ZGroup } from "./z-group";

export class Map<TResource> {
    private tileSets: TileSetCollection<TResource>;

    constructor(public size: Vec2, private layers: MapLayer[], tileSets: TileSet<TResource>[]) {
        this.tileSets = new TileSetCollection(tileSets);

        this.normalizeZIndexes();
    }

    private normalizeZIndexes(): void {
        if (this.layers.length === 0) { return; }
        let zIndex = 0;
        let lastLayerClass: Constructable<MapLayer, unknown[]> | undefined;
        for (const layer of this.layers) {
            if (typeof lastLayerClass === "undefined") {
                layer.zIndex = zIndex;
                zIndex++;
            }
            else if (typeof layer.zIndex === "undefined") {
                if (layer.constructor === lastLayerClass) {
                    zIndex++;
                    layer.zIndex = zIndex;
                }
                else {
                    layer.zIndex = zIndex;
                }
            } else if (layer.zIndex < zIndex) {
                throw new Error("Layers provided in incorrectorder.");
            } else {
                zIndex++;
                layer.zIndex = zIndex;
            }
            lastLayerClass = layer.constructor as Constructable<MapLayer, unknown[]>;
        }
    }

    public get maxZIndex() {
        return this.layers[this.layers.length - 1].zIndex;
    }

    public at(coord: Vec2): ZGroups<TResource>;
    public at(coord: Vec2, zIndex: number): ZGroup<TResource>;
    public at(coord: Vec2, zIndex?: number): ZGroups<TResource> | ZGroup<TResource> {
        let currentZIndex = 
        for (const layer of this.layers) {
            if ()
            tiles.push(layer.at(coord))
        }
        if (typeof zIndex !== "undefined") {
        }
        return tiles;
    }
}
