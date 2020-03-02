import { Map2d, Map2dLayer, TileStack, DrawOrder, IterationOrder, Map2dShape } from "../src";
import { createMap } from "friengine-test-utils";
import { Texture } from "friengine-graphics";
import { vec2, rect } from "friengine-core";

describe("Map2d", () => {
    let map2d: Map2d<Texture>;
    let layers: Map2dLayer[];

    beforeEach(() => {
        map2d = createMap();
        layers = map2d.layers;
    });

    describe("with invalid data", () => {
        beforeEach(() => {
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

        it("throws an error when accessing a tile with an invalid id at specific z index", () =>
            expect(() => map2d.at(vec2(5, 2), 1)).toThrowErrorMatchingInlineSnapshot(
                `"Layer has tile with invalid tile type id (190)."`,
            ));
    });

    describe.each([
        /* eslint-disable */
        [
            DrawOrder.LEFT_DOWN,
            // prettier-ignore
            [
                vec2(6, 0), vec2(5, 0), vec2(4, 0), vec2(3, 0), vec2(2, 0), vec2(1, 0), vec2(0, 0), 
                vec2(6, 1), vec2(5, 1), vec2(4, 1), vec2(3, 1), vec2(2, 1), vec2(1, 1), vec2(0, 1), 
                vec2(6, 2), vec2(5, 2), vec2(4, 2), vec2(3, 2), vec2(2, 2), vec2(1, 2), vec2(0, 2), 
                vec2(6, 3), vec2(5, 3), vec2(4, 3), vec2(3, 3), vec2(2, 3), vec2(1, 3), vec2(0, 3), 
                vec2(6, 4), vec2(5, 4), vec2(4, 4), vec2(3, 4), vec2(2, 4), vec2(1, 4), vec2(0, 4), 
                vec2(6, 5), vec2(5, 5), vec2(4, 5), vec2(3, 5), vec2(2, 5), vec2(1, 5), vec2(0, 5), 
                vec2(6, 6), vec2(5, 6), vec2(4, 6), vec2(3, 6), vec2(2, 6), vec2(1, 6), vec2(0, 6), 
            ],
        ],
        [
            DrawOrder.RIGHT_DOWN,
            // prettier-ignore
            [
                vec2(0, 0), vec2(1, 0), vec2(2, 0), vec2(3, 0), vec2(4, 0), vec2(5, 0), vec2(6, 0), 
                vec2(0, 1), vec2(1, 1), vec2(2, 1), vec2(3, 1), vec2(4, 1), vec2(5, 1), vec2(6, 1), 
                vec2(0, 2), vec2(1, 2), vec2(2, 2), vec2(3, 2), vec2(4, 2), vec2(5, 2), vec2(6, 2), 
                vec2(0, 3), vec2(1, 3), vec2(2, 3), vec2(3, 3), vec2(4, 3), vec2(5, 3), vec2(6, 3), 
                vec2(0, 4), vec2(1, 4), vec2(2, 4), vec2(3, 4), vec2(4, 4), vec2(5, 4), vec2(6, 4), 
                vec2(0, 5), vec2(1, 5), vec2(2, 5), vec2(3, 5), vec2(4, 5), vec2(5, 5), vec2(6, 5), 
                vec2(0, 6), vec2(1, 6), vec2(2, 6), vec2(3, 6), vec2(4, 6), vec2(5, 6), vec2(6, 6), 
            ],
        ],
        [
            DrawOrder.LEFT_UP,
            // prettier-ignore
            [
                vec2(6, 6), vec2(5, 6), vec2(4, 6), vec2(3, 6), vec2(2, 6), vec2(1, 6), vec2(0, 6), 
                vec2(6, 5), vec2(5, 5), vec2(4, 5), vec2(3, 5), vec2(2, 5), vec2(1, 5), vec2(0, 5), 
                vec2(6, 4), vec2(5, 4), vec2(4, 4), vec2(3, 4), vec2(2, 4), vec2(1, 4), vec2(0, 4), 
                vec2(6, 3), vec2(5, 3), vec2(4, 3), vec2(3, 3), vec2(2, 3), vec2(1, 3), vec2(0, 3), 
                vec2(6, 2), vec2(5, 2), vec2(4, 2), vec2(3, 2), vec2(2, 2), vec2(1, 2), vec2(0, 2), 
                vec2(6, 1), vec2(5, 1), vec2(4, 1), vec2(3, 1), vec2(2, 1), vec2(1, 1), vec2(0, 1), 
                vec2(6, 0), vec2(5, 0), vec2(4, 0), vec2(3, 0), vec2(2, 0), vec2(1, 0), vec2(0, 0), 
            ],
        ],
        [
            DrawOrder.RIGHT_UP,
            // prettier-ignore
            [
                vec2(0, 6), vec2(1, 6), vec2(2, 6), vec2(3, 6), vec2(4, 6), vec2(5, 6), vec2(6, 6), 
                vec2(0, 5), vec2(1, 5), vec2(2, 5), vec2(3, 5), vec2(4, 5), vec2(5, 5), vec2(6, 5), 
                vec2(0, 4), vec2(1, 4), vec2(2, 4), vec2(3, 4), vec2(4, 4), vec2(5, 4), vec2(6, 4), 
                vec2(0, 3), vec2(1, 3), vec2(2, 3), vec2(3, 3), vec2(4, 3), vec2(5, 3), vec2(6, 3), 
                vec2(0, 2), vec2(1, 2), vec2(2, 2), vec2(3, 2), vec2(4, 2), vec2(5, 2), vec2(6, 2), 
                vec2(0, 1), vec2(1, 1), vec2(2, 1), vec2(3, 1), vec2(4, 1), vec2(5, 1), vec2(6, 1), 
                vec2(0, 0), vec2(1, 0), vec2(2, 0), vec2(3, 0), vec2(4, 0), vec2(5, 0), vec2(6, 0), 
            ],
        ],
        /* eslint-enable */
    ])("with draworder %s", (drawOrder, expectedPositions) => {
        beforeEach(() => (map2d.drawOrder = drawOrder));

        it("yields the expected positions", () => expect([...map2d.positionIterator()]).toEqual(expectedPositions));

        it("yields the tiles in correct Z order with Z_LAST", () => {
            expect([...map2d.tiles()].map(({ z, position }) => ({ z, position }))).toEqual([
                ...expectedPositions.map(position => ({ z: 0, position })),
                ...expectedPositions.map(position => ({ z: 1, position })),
            ]);
        });

        it("yields the tiles in correct Z order with Z_FIRST", () => {
            expect([...map2d.tiles(IterationOrder.Z_FIRST)].map(({ z, position }) => ({ z, position }))).toEqual([
                ...expectedPositions.reduce(
                    (result, position) => [...result, { z: 0, position }, { z: 1, position }],
                    [] as any,
                ),
            ]);
        });
    });

    it("throws when accessing layer at unknown z index", () =>
        expect(() => map2d.at(vec2(0, 0), 100)).toThrowErrorMatchingInlineSnapshot(`"Unknown layer."`));

    it("throws when accessing layer at invalid position", () =>
        expect(() => map2d.at(vec2(100, 0))).toThrowErrorMatchingInlineSnapshot(`"Position out of range."`));

    it("returns a tilestack when accessing without layer", () => {
        expect(map2d.at(vec2(4, 4))).toEqual(
            new TileStack([
                {
                    tileType: {
                        id: 4,
                        spriteHandle: expect.anything(),
                        dimensions: vec2(16, 16),
                    },
                    objects: [{ shape: Map2dShape.POINT,  id: 1, name: "Object 1", type: "type-1", position: vec2(4, 4) }],
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
