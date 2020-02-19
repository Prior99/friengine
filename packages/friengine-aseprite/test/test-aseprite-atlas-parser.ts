import { AtlasParserStatus, Atlas, AnimationDirection, Animation } from "friengine-atlas";
import { rect } from "friengine-core";
import { parseAsepriteAtlas } from "../src";

describe("parseAsepriteAtlas", () => {
    it("returns error with bad input", () =>
        expect(parseAsepriteAtlas(null)).toEqual({ status: AtlasParserStatus.ERROR }));

    it("parses example", () =>
        expect(
            parseAsepriteAtlas({
                frames: {
                    "file-0.ase": {
                        frame: { x: 0, y: 0, w: 16, h: 24 },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: { x: 0, y: 0, w: 16, h: 24 },
                        sourceSize: { w: 16, h: 24 },
                        duration: 100,
                    },
                    "file-1.ase": {
                        frame: { x: 16, y: 0, w: 16, h: 24 },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: { x: 0, y: 0, w: 16, h: 24 },
                        sourceSize: { w: 16, h: 24 },
                        duration: 200,
                    },
                    "file-2.ase": {
                        frame: { x: 32, y: 0, w: 16, h: 24 },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: { x: 0, y: 0, w: 16, h: 24 },
                        sourceSize: { w: 16, h: 24 },
                        duration: 100,
                    },
                },
                meta: {
                    app: "http://www.aseprite.org/",
                    version: "1.3-dev",
                    image: "example.png",
                    format: "I8",
                    size: { w: 256, h: 24 },
                    scale: "1",
                    frameTags: [
                        { name: "Animation 1", from: 0, to: 1, direction: "forward" },
                        { name: "Animation 2", from: 1, to: 2, direction: "reverse" },
                        { name: "Animation 3", from: 0, to: 2, direction: "pingpong" },
                    ],
                },
            }),
        ).toEqual({
            status: AtlasParserStatus.SUCCESS,
            atlas: new Atlas(
                "example.png",
                [
                    {
                        rect: rect(0, 0, 16, 24),
                        duration: 100,
                    },
                    {
                        rect: rect(16, 0, 16, 24),
                        duration: 200,
                    },
                    {
                        rect: rect(32, 0, 16, 24),
                        duration: 100,
                    },
                ],
                [
                    new Animation("Animation 1", 0, 1, AnimationDirection.FORWARD),
                    new Animation("Animation 2", 1, 2, AnimationDirection.REVERSE),
                    new Animation("Animation 3", 0, 2, AnimationDirection.PING_PONG),
                ],
            ),
        }));

    it("parses minimal example", () =>
        expect(
            parseAsepriteAtlas({
                frames: {},
                meta: {
                    app: "http://www.aseprite.org/",
                    version: "1.3-dev",
                    image: "example.png",
                    format: "I8",
                    size: { w: 256, h: 24 },
                    scale: "1",
                },
            }),
        ).toEqual({
            status: AtlasParserStatus.SUCCESS,
            atlas: new Atlas("example.png", [], [new Animation("default", 0, -1, AnimationDirection.FORWARD)]),
        }));
});
