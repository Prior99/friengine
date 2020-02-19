import { isTiledDrawOrder, isTiledLayerBase, isTiledLayerObjects, isTiledLayerTiles, isTiledLayer } from "../src";
import { commonBadTypes, layerBase, layerTiles, layerObjects } from "./fixtures";

describe("tiled layer types", () => {

    describe("isTiledDrawOrder", () => {
        it.each([...commonBadTypes, "something"])("doesn't pass %j", (input: any) =>
            expect(isTiledDrawOrder(input)).toBe(false),
        );

        it.each(["topdown", "index"])("passes %j", (input: any) => expect(isTiledDrawOrder(input)).toBe(true));
    });

    describe("isTiledLayerBase", () => {
        it.each([
            ...commonBadTypes,
            {
                id: 9,
            },
            {
                id: 9,
                name: "layer-base",
            },
            {
                id: 9,
                name: "layer-base",
                visible: true,
            },
            {
                id: 9,
                name: "layer-base",
                visible: true,
                opacity: 1,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledLayerBase(input)).toBe(false));

        it.each([layerBase])("passes %j", (input: any) => expect(isTiledLayerBase(input)).toBe(true));
    });

    describe("isTiledLayerObjects", () => {
        it.each([
            ...commonBadTypes,
            {
                draworder: "topdown",
            },
            {
                draworder: "topdown",
                type: "objectgroup",
            },
            {
                draworder: "topdown",
                type: "objectgroup",
                objects: [],
            },
            {
                draworder: "topdown",
                type: "objectgroup",
                objects: [{}],
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledLayerObjects(input)).toBe(false));

        it.each([layerObjects])("passes %j", (input: any) => expect(isTiledLayerObjects(input)).toBe(true));
    });

    describe("isTiledLayerTiles", () => {
        it.each([
            ...commonBadTypes,
            {
                data: [{}],
            },
            {
                data: [],
                width: 1,
                height: 1,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledLayerTiles(input)).toBe(false));

        it.each([layerTiles])("passes %j", (input: any) => expect(isTiledLayerTiles(input)).toBe(true));
    });

    describe("isTiledLayer", () => {
        it.each([...commonBadTypes, layerBase])("doesn't pass %j", (input: any) =>
            expect(isTiledLayer(input)).toBe(false),
        );

        it.each([layerTiles, layerObjects])("passes %j", (input: any) => expect(isTiledLayer(input)).toBe(true));
    });
});
