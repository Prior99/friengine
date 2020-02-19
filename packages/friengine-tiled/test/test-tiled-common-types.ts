import { isTiledPosition, isTiledDimensions, isTiledOrientation } from "../src";
import { commonBadTypes } from "./fixtures";

describe("tiled common types", () => {
    describe("isTiledPosition", () => {
        it.each([...commonBadTypes, { x: 0 }, { y: 0 }, { x: null, y: 9 }])("doesn't pass %j", (input: any) =>
            expect(isTiledPosition(input)).toBe(false),
        );

        it.each([{ x: 0, y: 0 }])("passes %j", (input: any) => expect(isTiledPosition(input)).toBe(true));
    });

    describe("isTiledDimensions", () => {
        it.each([...commonBadTypes, { width: 0 }, { height: 0 }, { width: null, height: 9 }])("doesn't pass %j", (input: any) =>
            expect(isTiledDimensions(input)).toBe(false),
        );

        it.each([{ width: 0, height: 0 }])("passes %j", (input: any) => expect(isTiledDimensions(input)).toBe(true));
    });

    describe("isTiledOrientation", () => {
        it.each([...commonBadTypes, "something"])("doesn't pass %j", (input: any) =>
            expect(isTiledOrientation(input)).toBe(false),
        );

        it.each(["isometric", "orthogonal", "staggered"])("passes %j", (input: any) => expect(isTiledOrientation(input)).toBe(true));
    });
});