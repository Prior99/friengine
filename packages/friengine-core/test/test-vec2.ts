import { vec2, Vec2 } from "../src";

describe("vec2", () => {
    describe("operations on one vector", () => {
        let v: Vec2;

        beforeEach(() => v = vec2(10, 20));

        it("area", () => expect(v.area).toBe(200));

        it("swapped", () => expect(v.swapped).toEqual(vec2(20, 10)));

        it("min", () => expect(v.min).toEqual(10));

        it("max", () => expect(v.max).toEqual(20));

        it("equals itself", () => expect(v.equals(v)).toBe(true));

        it("length", () => expect(vec2(10, 0).length).toBe(10));

        it("normalized", () => expect(vec2(10, 0).normalized).toEqual(vec2(1, 0)));

        it("add scalar", () => expect(v.add(5)).toEqual(vec2(15, 25)));

        it("sub scalar", () => expect(v.sub(5)).toEqual(vec2(5, 15)));

        it("div scalar", () => expect(v.div(5)).toEqual(vec2(2, 4)));

        it("mult scalar", () => expect(v.mult(5)).toEqual(vec2(50, 100)));

        it("mod scalar", () => expect(v.mod(5)).toEqual(vec2(0, 0)));
    });

    describe("operations on two vectors", () => {
        let v1: Vec2;
        let v2: Vec2;

        beforeEach(() => {
            v1 = vec2(5, 10);
            v2 = vec2(10, 10);
        });

        it("add", () => expect(v1.add(v2)).toEqual(vec2(15, 20)));

        it("sub", () => expect(v1.sub(v2)).toEqual(vec2(-5, 0)));

        it("div", () => expect(v1.div(v2)).toEqual(vec2(0.5, 1)));

        it("mult", () => expect(v1.mult(v2)).toEqual(vec2(50, 100)));

        it("mod", () => expect(v1.mod(v2)).toEqual(vec2(5, 0)));

        it("distance", () => expect(v1.distance(v2)).toBe(5));
    });

    it.each([{ x: 1, y: 2}, 7, [1, 2]])("#j is not a vec2", (v) => expect(Vec2.isVec2(v)).toBe(false));

    it.each([vec2(1, 1), new Vec2(0, 0)])("#j is a vec2", (v) => expect(Vec2.isVec2(v)).toBe(true));

});