import { TileSet, TileType } from "./tile-set";

export interface IndexedTileSet<TResource> {
    tileSet: TileSet<TResource>;
    index: number;
}

export class TileSetCollection<TResource> {
    private tileSets: IndexedTileSet<TResource>[] = [];

    constructor(tileSets: TileSet<TResource>[]) {
        let index = 1;
        for (const tileSet of tileSets) {
            this.tileSets.push({ index, tileSet });
            index += tileSet.upperLimit + 1;
        }
    }

    private getIndexedTileSetForTile(tileId: number): IndexedTileSet<TResource> | undefined {
        for (const indexedTileSet of this.tileSets) {
            const { index, tileSet } = indexedTileSet;
            if (tileId <= index + tileSet.upperLimit) {
                return indexedTileSet;
            }
        }
    }

    public byId(id: number): TileType<TResource> | undefined {
        const indexedTileSet = this.getIndexedTileSetForTile(id);
        if (!indexedTileSet) { return; }
        const { index, tileSet } = indexedTileSet;
        const localId = id - index;
        return tileSet.byId(localId);
    }
}