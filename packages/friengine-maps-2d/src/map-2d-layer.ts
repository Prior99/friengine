import { Rect, Vec2, vec2, rect } from "friengine-core";

export enum Map2dShape {
    POINT = "point",
    ELLIPSE = "ellipse",
    RECTANGLE = "rectangle",
    POLYGON = "polygon",
}

export interface Map2dObjectPolygon extends Map2dObjectBase {
    shape: Map2dShape.POLYGON;
    vertices: Vec2[];
}

export interface Map2dObjectPrimitive extends Map2dObjectBase {
    shape: Map2dShape.POINT;
    position: Vec2;
}

export interface Map2dObjectArea extends Map2dObjectBase {
    shape: Map2dShape.ELLIPSE | Map2dShape.RECTANGLE;
    area: Rect;
}

export interface Map2dObjectBase {
    shape: Map2dShape;
    visible?: boolean;
    rotation?: number;
    type: string;
    name: string;
    id: number;
    customProperties?: Map<string, string | number | boolean>;
}

export type Map2dObject = Map2dObjectPolygon | Map2dObjectPrimitive | Map2dObjectArea;

export class Map2dLayer {
    constructor(public area: Rect, public data: number[], public objects: Map2dObject[] = []) {
        if (data.length !== area.area) {
            throw new Error(`Invalid data for map layer. Expected ${area.area} ids, but got ${data.length}.`);
        }
    }

    public tileTypeIdAt(position: Vec2, absolute = true): number {
        const relativePosition = absolute ? position.sub(this.area.topLeft) : position;
        return this.data[relativePosition.x + relativePosition.y * this.area.dimensions.x] ?? 0;
    }

    public objectsWithin(arg1: Rect | Vec2, absolute = true): Map2dObject[] {
        const area = Rect.isRect(arg1) ? arg1 : rect(arg1, vec2(1, 1));
        const relativeArea = absolute ? area.offset(this.area.topLeft.mult(-1)) : area;
        return this.objects
            .filter(obj => {
                switch (obj.shape) {
                    case Map2dShape.POINT:
                        return relativeArea.contains(obj.position);
                    case Map2dShape.ELLIPSE:
                        // TODO: Implement correct algorithm.
                        return relativeArea.intersects(obj.area);
                    case Map2dShape.RECTANGLE:
                        // TODO: Implement correct algorithm.
                        return relativeArea.intersects(obj.area);
                    case Map2dShape.POLYGON:
                        return obj.vertices.some(pos => relativeArea.contains(pos));
                }
            })
            .map(obj => {
                if (!absolute) { return obj; }
                switch (obj.shape) {
                    case Map2dShape.POINT:
                        return { ...obj, position: obj.position.add(this.area.topLeft) };
                    case Map2dShape.ELLIPSE:
                    case Map2dShape.RECTANGLE:
                        return { ...obj, position: obj.area.offset(this.area.topLeft) };
                    case Map2dShape.POLYGON:
                        return { ...obj, vertices: obj.vertices.map(pos => pos.add(this.area.topLeft)) };
                }
            });
    }
}
