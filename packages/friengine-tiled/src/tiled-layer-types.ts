/* eslint-disable @typescript-eslint/no-explicit-any */
import { TiledPosition, isTiledPosition, TiledDimensions, isTiledDimensions } from "./tiled-common-types";
import { TiledObject, isTiledObject } from "./tiled-object-types";

export type TiledDrawOrder = "topdown" | "index";

export function isTiledDrawOrder(order: any): order is TiledDrawOrder {
    return order === "topdown" || order === "index";
}

export interface TiledLayerBase extends TiledPosition {
    id: number;
    name: string;
    visible: boolean;
    opacity: number;
}

export function isTiledLayerBase(layerBase: any): layerBase is TiledLayerBase {
    if (typeof layerBase !== "object" || layerBase === null) {
        return false;
    }
    if (typeof layerBase.id !== "number") { return false; }
    if (typeof layerBase.name !== "string") { return false; }
    if (typeof layerBase.visible !== "boolean") { return false; }
    if (typeof layerBase.opacity !== "number") { return false; }
    if (!isTiledPosition(layerBase)) { return false; }
    return true;
}

export interface TiledLayerObjects extends TiledLayerBase {
    draworder: TiledDrawOrder;
    type: "objectgroup";
    objects: TiledObject[];

}

export function isTiledLayerObjects(layerObjects: any): layerObjects is TiledLayerObjects {
    if (typeof layerObjects !== "object" || layerObjects === null) {
        return false;
    }
    if (!isTiledDrawOrder(layerObjects.draworder)) { return false; }
    if (layerObjects.type !== "objectgroup") { return false; }
    if (!Array.isArray(layerObjects.objects)) { return false; }
    if (layerObjects.objects.length > 0 && layerObjects.objects.some((obj: any) => !isTiledObject(obj))) { return false; }
    if (!isTiledLayerBase(layerObjects)) { return false; }
    return true;
}

export interface TiledLayerTiles extends TiledLayerBase, TiledDimensions, TiledPosition {
    data: number[]
    type: "tilelayer";
    width: number;
    height: number;
}

export function isTiledLayerTiles(layerTiles: any): layerTiles is TiledLayerTiles {
    if (typeof layerTiles !== "object" || layerTiles === null) {
        return false;
    }
    if (!Array.isArray(layerTiles.data)) { return false; }
    if (layerTiles.data.length > 0 && layerTiles.data.some((id: any) => typeof id !== "number")) { return false; }
    if (!isTiledDimensions(layerTiles)) { return false; }
    if (!isTiledLayerBase(layerTiles)) { return false; }
    return true;
}

export type TiledLayer = TiledLayerObjects | TiledLayerTiles;

export function isTiledLayer(layer: any): layer is TiledLayer {
    return isTiledLayerObjects(layer) || isTiledLayerTiles(layer);
}

/* eslint-enable @typescript-eslint/no-explicit-any */