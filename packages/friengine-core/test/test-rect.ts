import { rect, vec2, Rect } from "../src";

describe("Rect", () => {
    describe.each([
        {
            topLeft: vec2(0, 0),
            dimensions: vec2(10, 10),
            bottomRight: vec2(10, 10),
            bottomLeft: vec2(0, 10),
            topRight: vec2(10, 0),
        },
        {
            topLeft: vec2(-10, -10),
            dimensions: vec2(20, 20),
            bottomRight: vec2(10, 10),
            bottomLeft: vec2(-10, 10),
            topRight: vec2(10, -10),
        },
        {
            topLeft: vec2(5, 5),
            dimensions: vec2(0, 0),
            bottomRight: vec2(5, 5),
            bottomLeft: vec2(5, 5),
            topRight: vec2(5, 5),
        },
    ])("test %#", ({ topLeft, dimensions, bottomRight, bottomLeft, topRight}) => {
        let testRect: Rect;

        describe("with vec2 as constructor arguments", () => {
            beforeEach(() => testRect = rect(topLeft, dimensions));

            it("has correct topLeft", () => expect(testRect.topLeft).toEqual(topLeft));

            it("has correct bottomRight", () => expect(testRect.bottomRight).toEqual(bottomRight));

            it("has correct bottomLeft", () => expect(testRect.bottomLeft).toEqual(bottomLeft));

            it("has correct topRight", () => expect(testRect.topRight).toEqual(topRight));

            it("has correct dimensions", () => expect(testRect.dimensions).toEqual(dimensions));
        });

        describe("with number as constructor arguments", () => {
            beforeEach(() => testRect = rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y));

            it("has correct topLeft", () => expect(testRect.topLeft).toEqual(topLeft));

            it("has correct bottomRight", () => expect(testRect.bottomRight).toEqual(bottomRight));

            it("has correct bottomLeft", () => expect(testRect.bottomLeft).toEqual(bottomLeft));

            it("has correct topRight", () => expect(testRect.topRight).toEqual(topRight));

            it("has correct dimensions", () => expect(testRect.dimensions).toEqual(dimensions));
        });
    });

    it.each([ { topLeft: vec2(0, 0), dimensions: vec2(10, 10)}])("#j is not a rect", (v) => expect(Rect.isRect(v)).toBe(false));

    it.each([rect(0, 0, 1, 1), new Rect(0, 0, 10, 10)])("#j is a rect", (v) => expect(Rect.isRect(v)).toBe(true));
});