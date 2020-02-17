import { MapLayer } from "./map-layer";
import { TileSetCollection } from "./tile-set-collection";
import { TileSet } from "./tile-set";

export class Map<TResource> {
    private layers: MapLayer[];
    private tileSets: TileSetCollection;

    constructor(private layers: MapLayer[], tileSets: TileSet<TResource>[]) {
        this.
    }
}