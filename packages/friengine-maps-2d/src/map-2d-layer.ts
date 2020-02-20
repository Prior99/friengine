import { Rect, Vec2, vec2, rect } from "friengine-core";

export interface Map2dObject {
    position: Vec2;
    visible?: boolean;
    rotation?: number;
    type: string;
    name: string;
    id: number;
    customProperties?: Map<string, string | number | boolean>;
}

export class Map2dLayer {
    constructor(public area: Rect, public data: number[], public objects: Map2dObject[] = []) {
        if (data.length !== area.area) {
            throw new Error(`Invalid data for map layer. Expected ${area.area} ids, but got ${data.length}.`);
        }
    }

    public tileTypeIdAt(position: Vec2, absolute = true): number {
        const relativePosition = absolute ? position.sub(this.area.topLeft) : position;
        return this.data[relativePosition.x + relativePosition.y * this.area.dimensions.x];
    }

    public objectsWithin(arg1: Rect | Vec2, absolute = true): Map2dObject[] {
        const area = Rect.isRect(arg1) ? arg1 : rect(arg1, vec2(1, 1));
        const relativeArea = absolute ? area.offset(this.area.topLeft.mult(-1)) : area;
        return this.objects
            .filter(obj => relativeArea.contains(obj.position))
            .map(obj => ({ ...obj, position: obj.position.add(this.area.topLeft) }));
    }
}
