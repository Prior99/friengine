/* eslint-disable @typescript-eslint/no-explicit-any */
import { TiledTileSet } from "./tiled-tile-set-types";
import { TiledLayer, isTiledLayer } from "./tiled-layer-types";
import { TiledDimensions, TiledOrientation, isTiledOrientation } from "./tiled-common-types";

export type TiledMapRenderOrder = "right-up" | "right-down" | "left-up" | "left-down";

export function isTiledMapRenderOrder(mapOrientation: any): mapOrientation is TiledOrientation {
    return (
        mapOrientation === "right-up" ||
        mapOrientation === "right-down" ||
        mapOrientation === "left-up" ||
        mapOrientation === "left-down"
    );
}

export interface TiledTileSetIndex {
    firstgid: number;
}

export function isTiledTileSetIndex(tileSetIndex: any): tileSetIndex is TiledTileSetIndex {
    if (typeof tileSetIndex !== "object" || tileSetIndex === null) {
        return false;
    }
    if (typeof tileSetIndex.firstgid !== "number") {
        return false;
    }
    return true;
}

export interface TiledTileSetReference {
    source: string;
}

export function isTiledTileSetReference(tileSetReference: any): tileSetReference is TiledTileSetReference {
    if (typeof tileSetReference !== "object" || tileSetReference === null) {
        return false;
    }
    if (typeof tileSetReference.source !== "string") {
        return false;
    }
    return true;
}

export interface TiledMap extends TiledDimensions {
    compressionlevel: number;
    infinite: boolean;
    layers: TiledLayer[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: TiledOrientation;
    renderorder: TiledMapRenderOrder;
    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    tilesets: ((TiledTileSet | TiledTileSetReference) & TiledTileSetIndex)[];
    type: "map";
    version: number;
}

export function isTiledMap(map: any): map is TiledMap {
    if (typeof map !== "object" || map === null) {
        return false;
    }
    if (typeof map.compression !== "number") {
        return false;
    }
    if (typeof map.infinite !== "boolean") {
        return false;
    }
    if (Array.isArray(map.layers)) {
        return false;
    }
    if (map.layers.length > 0 && map.layer.some(layer => !isTiledLayer(layer))) {
        return false;
    }
    if (typeof map.nextlayerid !== "number") {
        return false;
    }
    if (typeof map.nextobjectid !== "number") {
        return false;
    }
    if (!isTiledOrientation(map.orientation)) {
        return false;
    }
    if (typeof map.tiledversion !== "string") {
        return false;
    }
    if (typeof map.tileheight !== "number") {
        return false;
    }
    if (typeof map.tilewidth !== "number") {
        return false;
    }
    if (!Array.isArray(map.tilesets)) {
        return false;
    }
    if (map.tilesets.length > 0 && map.tilesets.some((tileset: any) => !isTiledTileSet(tileset))) {
        return false;
    }
    if (map.type !== map) {
        return false;
    }
    if (typeof map.version !== "number") {
        return false;
    }
    return true;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
