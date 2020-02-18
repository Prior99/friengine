import { TiledDimensions, TiledOrientation, isTiledOrientation, isTiledDimensions } from "./tiled-common-types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TiledImage {
    image: string;
    imageheight: number;
    imagewidth: number;
}

export function isTiledImage(image: any): image is TiledImage {
    if (typeof image !== "object" || image === null) {
        return false;
    }
    if (typeof image.image !== "string") {
        return false;
    }
    if (typeof image.imagewidth !== "number") {
        return false;
    }
    if (typeof image.imageheight !== "number") {
        return false;
    }
    return true;
}

export interface TiledGrid extends TiledDimensions {
    orientation: TiledOrientation;
}

export function isTiledGrid(grid: any): grid is TiledGrid {
    if (typeof grid !== "object" || grid === null) {
        return false;
    }
    if (!isTiledOrientation(grid.orientation)) {
        return false;
    }
    if (!isTiledDimensions(grid)) {
        return false;
    }
    return true;
}

export interface TiledTileSetBase {
    name: string;
    version: number;
    type: "tileset";
    tilewidth: number;
    tileheight: number;
    tiledversion: string;
    tilecount: number;
}

export function isTiledTileSetBase(tileSetBase: any): tileSetBase is TiledTileSetBase {
    if (typeof tileSetBase !== "object" || tileSetBase === null) {
        return false;
    }
    if (typeof tileSetBase.name !== "string") {
        return false;
    }
    if (typeof tileSetBase.version !== "number") {
        return false;
    }
    if (tileSetBase.type !== "tileset") {
        return false;
    }
    if (typeof tileSetBase.tilewidth !== "number") {
        return false;
    }
    if (typeof tileSetBase.tileheight !== "number") {
        return false;
    }
    if (typeof tileSetBase.tiledversion !== "string") {
        return false;
    }
    if (typeof tileSetBase.tilecount !== "number") {
        return false;
    }
    return true;
}

export interface TiledTileSetSheet extends TiledImage {
    columns: number;
    margin: number;
    spacing: number;
}

export function isTiledTileSetSheet(tileSetSheet: any): tileSetSheet is TiledTileSetSheet {
    if (typeof tileSetSheet !== "object" || tileSetSheet === null) {
        return false;
    }
    if (typeof tileSetSheet.columns !== "number") {
        return false;
    }
    if (typeof tileSetSheet.margin !== "number") {
        return false;
    }
    if (typeof tileSetSheet.spacing !== "number") {
        return false;
    }
    if (!isTiledTileSetBase(tileSetSheet)) {
        return false;
    }
    return true;
}

export interface TiledTile extends TiledImage {
    id: number;
}

export function isTiledTile(tile: any): tile is TiledTile {
    if (typeof tile !== "object" || tile === null) {
        return false;
    }
    if (typeof tile.id !== "number") {
        return false;
    }
    if (!isTiledImage(tile)) {
        return false;
    }
    return true;
}

export interface TiledTileSetCollection extends TiledTileSetBase {
    grid: TiledGrid;
    tiles: TiledTile[];
}

export function isTiledTileSetCollection(tileSetCollection: any): tileSetCollection is TiledTileSetCollection {
    if (typeof tileSetCollection !== "object" || tileSetCollection === null) {
        return false;
    }
    if (!isTiledGrid(tileSetCollection.grid)) {
        return false;
    }
    if (!Array.isArray(tileSetCollection.tiles)) {
        return false;
    }
    if (tileSetCollection.tiles.length > 0 && tileSetCollection.tiles.some((tile: any) => !isTiledTile(tile))) {
        return false;
    }
    if (!isTiledTileSetBase(tileSetCollection)) {
        return false;
    }
    return true;
}

export type TiledTileSet = TiledTileSetCollection | TiledTileSetSheet;

export function isTiledTileSet(tileSet: any): tileSet is TiledTileSet {
    return isTiledTileSetCollection(tileSet) || isTiledTileSetSheet(tileSet);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
