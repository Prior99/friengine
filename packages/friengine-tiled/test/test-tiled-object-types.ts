import { commonBadTypes, objectBase, objectPoint, objectPolygon, objectRect, objectEllipse } from "./fixtures";
import {
    isTiledObjectBase,
    isTiledObjectPoint,
    isTiledObjectEllipse,
    isTiledObjectPolygon,
    isTiledObjectRect,
    isTiledObject,
} from "../src";

describe("tiled object types", () => {
    describe("isTiledObjectBase", () => {
        it.each([
            ...commonBadTypes,
            {
                rotation: 0,
            },
            {
                rotation: 0,
                visible: true,
            },
            {
                rotation: 0,
                visible: true,
                type: "some-type",
            },
            {
                rotation: 0,
                visible: true,
                type: "some-type",
                name: "some-name",
            },
            {
                rotation: 0,
                visible: true,
                type: "some-type",
                name: "some-name",
            },
        ])("doesn't pass %j", (input: any) => expect(isTiledObjectBase(input)).toBe(false));

        it.each([objectBase])("passes %j", (input: any) => expect(isTiledObjectBase(input)).toBe(true));
    });

    describe("isTiledObjectPoint", () => {
        it.each([...commonBadTypes, objectBase, { point: true }])("doesn't pass %j", (input: any) =>
            expect(isTiledObjectPoint(input)).toBe(false),
        );

        it.each([objectPoint])("passes %j", (input: any) => expect(isTiledObjectPoint(input)).toBe(true));
    });

    describe("isTiledObjectPolygon", () => {
        it.each([...commonBadTypes, objectBase, { polygon: [] }, { polygon: [{}] }])("doesn't pass %j", (input: any) =>
            expect(isTiledObjectPolygon(input)).toBe(false),
        );

        it.each([objectPolygon])("passes %j", (input: any) => expect(isTiledObjectPolygon(input)).toBe(true));
    });

    describe("isTiledObjectEllipse", () => {
        it.each([...commonBadTypes, objectBase, { ellipse: true }])("doesn't pass %j", (input: any) =>
            expect(isTiledObjectEllipse(input)).toBe(false),
        );

        it.each([objectEllipse])("passes %j", (input: any) => expect(isTiledObjectEllipse(input)).toBe(true));
    });

    describe("isTiledObjectRect", () => {
        it.each([...commonBadTypes])("doesn't pass %j", (input: any) => expect(isTiledObjectRect(input)).toBe(false));

        it.each([objectRect])("passes %j", (input: any) => expect(isTiledObjectRect(input)).toBe(true));
    });

    describe("isTiledObject", () => {
        it.each([...commonBadTypes])("doesn't pass %j", (input: any) => expect(isTiledObject(input)).toBe(false));

        it.each([objectRect, objectPoint, objectPolygon, objectEllipse])("passes %j", (input: any) =>
            expect(isTiledObject(input)).toBe(true),
        );
    });
});
