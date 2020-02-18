/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TiledPosition {
    x: number;
    y: number;
}

export function isTiledPosition(position: any): position is TiledPosition {
    if (typeof position !== "object" || position === null) {
        return false;
    }
    if (typeof position.x !== "number") {
        return false;
    }
    if (typeof position.y !== "number") {
        return false;
    }
    return true;
}

export interface TiledDimensions {
    width: number;
    height: number;
}

export function isTiledDimensions(dimensions: any): dimensions is TiledDimensions {
    if (typeof dimensions !== "object" || dimensions === null) {
        return false;
    }
    if (typeof dimensions.width !== "number") {
        return false;
    }
    if (typeof dimensions.height !== "number") {
        return false;
    }
    return true;
}

export type TiledOrientation = "isometric" | "orthogonal" | "staggered";

export function isTiledOrientation(mapOrientation: any): mapOrientation is TiledOrientation {
    return mapOrientation === "isometric" || mapOrientation === "orthogonal" || mapOrientation === "staggered";
}

/* eslint-enable @typescript-eslint/no-explicit-any */