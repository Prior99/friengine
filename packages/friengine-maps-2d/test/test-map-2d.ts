import { Map2d, Map2dLayer, TileStack } from "../src";
import { createMap } from "friengine-test-utils";
import { Texture } from "friengine-graphics";
import { vec2, rect } from "friengine-core";

describe("Map2d", () => {
    let map2d: Map2d<Texture>;
    let layers: Map2dLayer[];

    beforeEach(() => {
        map2d = createMap();
        layers = map2d.layers;
        layers[1].data[19] = 190;
    });

    it("throws an error when accessing an unknown layer by index", () =>
        expect(() => map2d.at(vec2(0, 0), 100)).toThrowErrorMatchingInlineSnapshot(`"Unknown layer."`));

    it("throws an error when accessing an unknown layer by layer", () =>
        expect(() => map2d.at(vec2(0, 0), new Map2dLayer(rect(0, 0, 5, 5), []))).toThrowErrorMatchingInlineSnapshot(
            `"Invalid data for map layer. Expected 25 ids, but got 0."`,
        ));

    it("throws an error when accessing a tile out of range", () =>
        expect(() => map2d.at(vec2(100, 100))).toThrowErrorMatchingInlineSnapshot(`"Position out of range."`));

    it("throws an error when accessing a tile with an invalid id", () =>
        expect(() => map2d.at(vec2(5, 2))).toThrowErrorMatchingInlineSnapshot(
            `"Layer has tile with invalid tile type id (190)."`,
        ));

    it("returns a tilestack when accessing without layer", () => {
        expect(map2d.at(vec2(4, 4))).toEqual(
            new TileStack([
                {
                    tileType: {
                        id: 4,
                        spriteHandle: expect.anything(),
                        dimensions: vec2(16, 16),
                    },
                    objects: [{ id: 1, name: "Object 1", type: "type-1", position: vec2(4, 4) }],
                    position: vec2(4, 4),
                    z: 0,
                },
                {
                    tileType: undefined,
                    objects: [],
                    position: vec2(4, 4),
                    z: 1,
                },
            ]),
        );
    });
});
