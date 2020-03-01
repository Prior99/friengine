import { Map2dLayer, Map2dObject } from "friengine-maps-2d";
import { rect, vec2 } from "friengine-core";
import { createObject } from "friengine-test-utils";

describe("Map2dLayer", () => {
    let layer: Map2dLayer;

    describe("with invalid arguments", () => {
        it("throws an exception", () =>
            expect(() => new Map2dLayer(rect(5, 5, 10, 10), [1, 2, 3])).toThrowErrorMatchingInlineSnapshot(
                `"Invalid data for map layer. Expected 100 ids, but got 3."`,
            ));
    });

    describe("with correct arguments", () => {
        let object1: Map2dObject;
        let object2: Map2dObject;

        beforeEach(() => {
            object1 = createObject(vec2(1, 1));
            object2 = createObject(vec2(0, 1));
            layer = new Map2dLayer(rect(1, 3, 2, 2), [1, 1, 1, 2], [object1, object2]);
        });

        it("has correct tile id at absolute position", () => expect(layer.tileTypeIdAt(vec2(2, 4))).toBe(2));

        it("has correct tile id at relative position", () => expect(layer.tileTypeIdAt(vec2(1, 1), false)).toBe(2));

        it("has correct objects within absolute rect", () =>
            expect(layer.objectsWithin(rect(1, 4, 1, 1))).toEqual([{ ...object2, position: vec2(1, 4) }]));

        it("has correct objects within relative rect", () =>
            expect(layer.objectsWithin(rect(0, 1, 1, 1), false)).toEqual([object2]));

        it("has correct objects within absolute vec", () =>
            expect(layer.objectsWithin(vec2(1, 4))).toEqual([{ ...object2, position: vec2(1, 4) }]));

        it("has correct objects within relative vec", () =>
            expect(layer.objectsWithin(vec2(0, 1), false)).toEqual([object2]));
    });
});
