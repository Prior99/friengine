import { Vec2, vec2 } from "./vec2";

export class Rect {
    public static isRect(obj: any): obj is Rect { // eslint-disable-line
        return obj instanceof Rect;
    }

    constructor(public topLeft: Vec2, public dimensions: Vec2) {}

    public get topRight(): Vec2 {
        return this.topLeft.add(vec2(this.dimensions.x, 0));
    }

    public get bottomLeft(): Vec2 {
        return this.topLeft.add(vec2(0, this.dimensions.y));
    }

    public get bottomRight(): Vec2 {
        return this.topLeft.add(this.dimensions);
    }
}

export function rect(x: number, y: number, width: number, height: number): Rect {
    return new Rect(vec2(x, y), vec2(width, height));
}