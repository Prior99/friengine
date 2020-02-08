export class Vec2 {
    public static isVec2(obj: any): obj is Vec2 { // eslint-disable-line
        return obj instanceof Vec2;
    }

    constructor(
        public x: number,
        public y: number,
    ) { }

    public get area(): number {
        return this.x * this.y;
    }

    public get swapped(): Vec2 {
        return new Vec2(this.y, this.x);
    }

    public get length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public get normalized(): Vec2 {
        return this.div(this.length);
    }

    public get min(): number {
        return Math.min(this.x, this.y);
    }

    public get max(): number {
        return Math.max(this.x, this.y);
    }

    public add(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return new Vec2(this.x + other, this.y + other);
        }
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    public sub(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return new Vec2(this.x - other, this.y - other);
        }
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    public div(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return new Vec2(this.x / other, this.y / other);
        }
        return new Vec2(this.x / other.x, this.y / other.y);
    }

    public mult(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return new Vec2(this.x * other, this.y * other);
        }
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    public equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public mod(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return new Vec2(this.x % other, this.y % other);
        }
        return new Vec2(this.x % other.x, this.y % other.y);
    }

    public distance(other: Vec2): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

}

export function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}
