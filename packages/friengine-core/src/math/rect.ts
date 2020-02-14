import { Vec2, vec2 } from "./vec2";

export class Rect {
    public static isRect(obj: any): obj is Rect {
        // eslint-disable-line
        return obj instanceof Rect;
    }
    public topLeft: Vec2;
    public dimensions: Vec2;

    constructor(topLeft: Vec2, dimensions: Vec2);
    constructor(x: number, y: number, width: number, height: number);
    constructor(arg1: number | Vec2, arg2: number | Vec2, arg3?: number, arg4?: number) {
        if (Vec2.isVec2(arg1)) {
            this.topLeft = arg1;
            this.dimensions = arg2 as Vec2;
        } else {
            this.topLeft = vec2(arg1, arg2 as number);
            this.dimensions = vec2(arg3 as number, arg4 as number);
        }
    }

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

export function rect(topLeft: Vec2, dimensions: Vec2): Rect;
export function rect(x: number, y: number, width: number, height: number): Rect;
export function rect(arg1: number | Vec2, arg2: number | Vec2, arg3?: number, arg4?: number): Rect {
    return new Rect(arg1 as number, arg2 as number, arg3 as number, arg4 as number);
}
