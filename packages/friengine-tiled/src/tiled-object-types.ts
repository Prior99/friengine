import { TiledPosition, TiledDimensions, isTiledPosition } from "./tiled-common-types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TiledObjectBase extends TiledPosition, TiledDimensions {
    rotation: number;
    visible: boolean;
    type: string;
    name: string;
    id: number;
}

export function isTiledObjectBase(objectBase: any): objectBase is TiledObjectBase {
    if (typeof objectBase !== "object" || objectBase === null) {
        return false;
    }
    if (typeof objectBase.rotation !== "number") {
        return false;
    }
    if (typeof objectBase.visible !== "boolean") {
        return false;
    }
    if (typeof objectBase.type !== "string") {
        return false;
    }
    if (typeof objectBase.name !== "string") {
        return false;
    }
    if (typeof objectBase.id !== "number") {
        return false;
    }
    return true;
}

export interface TiledObjectPoint extends TiledObjectBase {
    point: true;
}

export function isTiledObjectPoint(objectPoint: any): objectPoint is TiledObjectPoint {
    if (typeof objectPoint !== "object" || objectPoint === null) {
        return false;
    }
    if (objectPoint.point !== true) {
        return false;
    }
    if (!isTiledObjectBase(objectPoint)) {
        return false;
    }
    return true;
}

export interface TiledObjectPolygon extends TiledObjectBase {
    polygon: TiledPosition[];
}

export function isTiledObjectPolygon(objectPolygon: any): objectPolygon is TiledObjectPolygon {
    if (typeof objectPolygon !== "object" || objectPolygon === null) {
        return false;
    }
    if (!Array.isArray(objectPolygon.polygon)) {
        return false;
    }
    if (objectPolygon.polygon.length > 0 && objectPolygon.polygon.some(point => !isTiledPosition(point))) {
        return false;
    }
    if (!isTiledObjectBase(objectPoint)) {
        return false;
    }
    return true;
}

export interface TiledObjectEllipse extends TiledObjectBase {
    ellipse: true;
}

export function isTiledObjectEllipse(objectEllipse: any): objectEllipse is TiledObjectEllipse {
    if (typeof objectEllipse !== "object" || objectEllipse === null) {
        return false;
    }
    if (objectEllipse.ellipse !== true) {
        return false;
    }
    if (!isTiledObjectBase(objectEllipse)) {
        return false;
    }
    return true;
}

export type TiledObjectRect = TiledObjectBase;

export function isTiledObjectRect(objectRect: any): objectRect is TiledObjectRect {
    return isTiledObjectBase(objectRect);
}

export type TiledObject = TiledObjectPoint | TiledObjectPolygon | TiledObjectEllipse | TiledObjectRect;

export function isTiledObject(obj: any): obj is TiledObject {
    return isTiledObjectPoint(obj) || isTiledObjectPolygon(obj) || isTiledObjectEllipse(obj) || isTiledObjectRect(obj);
}
