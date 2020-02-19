import { isTiledMapRenderOrder, isTiledTileSetIndex, isTiledTileSetReference, isTiledMap } from "../src";
import { commonBadTypes, tileSetIndex, tileSetReference, map } from "./fixtures";

describe("tiled map types", () => {
    describe("isTiledMapRenderOrder", () => {
        it.each([...commonBadTypes, "something"])("doesn't pass %j", (input: any) =>
            expect(isTiledMapRenderOrder(input)).toBe(false),
        );

        it.each(["right-up", "right-down", "left-up", "left-down"])("passes %j", (input: any) =>
            expect(isTiledMapRenderOrder(input)).toBe(true),
        );
    });

    describe("isTiledTileSetIndex", () => {
        it.each([...commonBadTypes])("doesn't pass %j", (input: any) => expect(isTiledTileSetIndex(input)).toBe(false));

        it.each([tileSetIndex])("passes %j", (input: any) => expect(isTiledTileSetIndex(input)).toBe(true));
    });

    describe("isTiledTileSetReference", () => {
        it.each([...commonBadTypes])("doesn't pass %j", (input: any) =>
            expect(isTiledTileSetReference(input)).toBe(false),
        );

        it.each([tileSetReference])("passes %j", (input: any) => expect(isTiledTileSetReference(input)).toBe(true));
    });

    describe("isTiledMap", () => {
        it.each([...commonBadTypes,
        {
            compression: 0,
        }, {
            compression: 0,
            infinite: false,
        }, {
            compression: 0,
            infinite: false,
            layers: [],
        }, {
            compression: 0,
            infinite: false,
            layers: [{}],
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
            tileheight: 16,
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
            tileheight: 16,
            tilewidth: 16,
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
            tileheight: 16,
            tilewidth: 16,
            tilesets: [],
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
            tileheight: 16,
            tilewidth: 16,
            tilesets: [{}],
        }, {
            compression: 0,
            infinite: false,
            layers: [],
            nextlayerid: 10,
            nextobjectid: 3,
            orientation: "orthogonal",
            tiledversion: "1.3.2",
            tileheight: 16,
            tilewidth: 16,
            tilesets: [],
            type: "map"
        }])("doesn't pass %j", (input: any) =>
            expect(isTiledMap(input)).toBe(false),
        );

        it.each([map])("passes %j", (input: any) => expect(isTiledMap(input)).toBe(true));
    });
});
