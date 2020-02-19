import { image, commonBadTypes, grid, tileSetBase, tileSetSheet, tile, tileSetCollection } from "./fixtures";
import {
    isTiledImage,
    isTiledGrid,
    isTiledTileSetBase,
    isTiledTileSetSheet,
    isTiledTile,
    isTiledTileSetCollection,
    isTiledTileSet,
} from "../src";

describe("tile set types", () => {
    describe("isTiledImage", () => {
        it.each([
            ...commonBadTypes,
            {
                image: "image.png",
            },
            {
                image: "image.png",
                imagewidth: 16,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledImage(input)).toBe(false));

        it.each([image])("passes %j", (input: any) => expect(isTiledImage(input)).toBe(true));
    });

    describe("isTiledGrid", () => {
        it.each([
            ...commonBadTypes,
            {
                orientation: "orthogonal",
            },
            {
                orientation: "orthogonal",
                width: 16,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledGrid(input)).toBe(false));

        it.each([grid])("passes %j", (input: any) => expect(isTiledGrid(input)).toBe(true));
    });

    describe("isTiledTileSetBase", () => {
        it.each([
            ...commonBadTypes,
            {
                name: "tileset-1",
            },
            {
                name: "tileset-1",
                version: 1.2,
            },
            {
                name: "tileset-1",
                version: 1.2,
                type: "tileset",
            },
            {
                name: "tileset-1",
                version: 1.2,
                type: "tileset",
                tilewidth: 16,
            },
            {
                name: "tileset-1",
                version: 1.2,
                type: "tileset",
                tilewidth: 16,
                tileheight: 16,
            },
            {
                name: "tileset-1",
                version: 1.2,
                type: "tileset",
                tilewidth: 16,
                tileheight: 16,
                tiledversion: "1.3.2",
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledTileSetBase(input)).toBe(false));

        it.each([tileSetBase])("passes %j", (input: any) => expect(isTiledTileSetBase(input)).toBe(true));
    });

    describe("isTiledTileSetSheet", () => {
        it.each([
            ...commonBadTypes,
            {
                columns: 2,
            },
            {
                columns: 2,
                margin: 0,
            },
            {
                columns: 2,
                margin: 0,
                spacing: 0,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledTileSetSheet(input)).toBe(false));

        it.each([tileSetSheet])("passes %j", (input: any) => expect(isTiledTileSetSheet(input)).toBe(true));
    });

    describe("isTiledTile", () => {
        it.each([
            ...commonBadTypes,
            {
                id: 2,
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledTile(input)).toBe(false));

        it.each([tile])("passes %j", (input: any) => expect(isTiledTile(input)).toBe(true));
    });

    describe("isTiledTileSetCollection", () => {
        it.each([
            ...commonBadTypes,
            {
                grid,
            },
            {
                grid,
                tiles: [],
            },
            {
                grid,
                tiles: [{}],
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledTileSetCollection(input)).toBe(false));

        it.each([tileSetCollection])("passes %j", (input: any) => expect(isTiledTileSetCollection(input)).toBe(true));
    });

    describe("isTiledTileSet", () => {
        it.each([...commonBadTypes])("doesn't pass %j", (input: any) => expect(isTiledTileSet(input)).toBe(false));

        it.each([tileSetSheet, tileSetCollection])("passes %j", (input: any) =>
            expect(isTiledTileSet(input)).toBe(true),
        );
    });
});
