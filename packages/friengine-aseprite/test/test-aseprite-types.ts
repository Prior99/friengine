import { isAsepriteOffset, isAsepriteDimensions, isAsepriteRect, isAsepriteFrame, isAsepriteFrameTagDirection, isAsepriteFrameTag, isAsepriteAtlas } from "../src";

describe("aseprite types", () => {
    const commonBadTypes = [null, undefined, "", 0, false, true, {}, []];

    describe("isAsepriteOffset", () => {
        it.each([...commonBadTypes, { x: 0 }, { y: 0 }, { x: null, y: 9 }])("doesn't pass %j", (input: any) =>
            expect(isAsepriteOffset(input)).toBe(false),
        );

        it.each([{ x: 0, y: 0 }])("passes %j", (input: any) => expect(isAsepriteOffset(input)).toBe(true));
    });

    describe("isAsepriteDimensions", () => {
        it.each([...commonBadTypes, { w: 0 }, { h: 0 }, { w: null, h: 9 }])("doesn't pass %j", (input: any) =>
            expect(isAsepriteDimensions(input)).toBe(false),
        );

        it.each([{ w: 0, h: 0 }])("passes %j", (input: any) => expect(isAsepriteDimensions(input)).toBe(true));
    });

    describe("isAsepriteRect", () => {
        it.each([...commonBadTypes, { x: 0, y: 0, w: 0 }, { w: 0, h: 0, y: 0 }])("doesn't pass %j", (input: any) =>
            expect(isAsepriteRect(input)).toBe(false),
        );

        it.each([{ x: 0, y: 0, w: 0, h: 0 }])("passes %j", (input: any) => expect(isAsepriteRect(input)).toBe(true));
    });

    describe("isAsepriteRect", () => {
        it.each([...commonBadTypes, { x: 0, y: 0, w: 0 }, { w: 0, h: 0, y: 0 }])("doesn't pass %j", (input: any) =>
            expect(isAsepriteRect(input)).toBe(false),
        );

        it.each([{ x: 0, y: 0, w: 0, h: 0 }])("passes %j", (input: any) => expect(isAsepriteRect(input)).toBe(true));
    });

    describe("isAsepriteFrame", () => {
        it.each([
            ...commonBadTypes,
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1 },
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
                trimmed: false,
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { w: 10, h: 10 },
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { w: 10, h: 10, x: 10, y: 10 },
                sourceSize: { w: 1 },
            },
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { w: 10, h: 10, x: 1, y: 1 },
                sourceSize: { w: 1, h: 1 },
            },
        ])("doesn't pass %j", (input: any) => expect(isAsepriteFrame(input)).toBe(false));

        it.each([
            {
                filename: "some-name.jpg",
                frame: { x: 1, y: 1, w: 10, h: 10 },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { w: 10, h: 10, x: 1, y: 1 },
                sourceSize: { w: 10, h: 10 },
                duration: 9,
            },
        ])("passes %j", (input: any) => expect(isAsepriteFrame(input)).toBe(true));
    });

    describe("isAsepriteFrameTagDirection", () => {
        it.each([
            ...commonBadTypes,
        ])("doesn't pass %j", (input: any) => expect(isAsepriteFrameTagDirection(input)).toBe(false));

        it.each([
            "forward",
            "reverse",
            "pingpong",
        ])("passes %j", (input: any) => expect(isAsepriteFrameTagDirection(input)).toBe(true));
    });

    describe("isAsepriteFrameTag", () => {
        it.each([
            ...commonBadTypes,
            {
                name: "some name",
            },
            {
                name: "some name",
                from: 0,
            },
            {
                name: "some name",
                from: 0,
                to: 1,
            },
            {
                name: "some name",
                from: 0,
                to: 1,
                direction: "test"
            },
        ])("doesn't pass %j", (input: any) => expect(isAsepriteFrameTag(input)).toBe(false));

        it.each([
            {
                name: "some name",
                from: 0,
                to: 1,
                direction: "forward"
            },
        ])("passes %j", (input: any) => expect(isAsepriteFrameTag(input)).toBe(true));
    });

    describe("isAsepriteAtlas", () => {
        it.each([
            ...commonBadTypes,
            {
                frames: [],
            },
            {
                frames: [null],
            },
            {
                frames: [],
                meta: {},
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                    size: { w: 10, h: 10 },
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                    size: { w: 10, h: 10 },
                    scale: "normal",
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                    size: { w: 10, h: 10 },
                    scale: "normal",
                    format: "RGBA",
                    frameTags: null,
                },
            },
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                    size: { w: 10, h: 10 },
                    scale: "normal",
                    format: "RGBA",
                    frameTags: [null],
                },
            },
        ])("doesn't pass %j", (input: any) => expect(isAsepriteAtlas(input)).toBe(false));

        it.each([
            {
                frames: [],
                meta: {
                    app: "test app",
                    version: "1.0.0",
                    image: "some-image.png",
                    size: { w: 10, h: 10 },
                    scale: "normal",
                    format: "RGBA",
                    frameTags: [],
                },
            },
        ])("passes %j", (input: any) => expect(isAsepriteAtlas(input)).toBe(true));
    });
});
