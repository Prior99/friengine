import { SpriteAnimated, ResourceDrawer2d } from "friengine-graphics-2d";
import { Texture, TextureManager } from "friengine-graphics";
import { ResourceHandle, vec2, rect } from "friengine-core";
import { Atlas } from "friengine-atlas";
import { createAtlas } from "friengine-test-utils";

describe("SpriteAnimated", () => {
    let spyDraw: jest.MockedFunction<any>;
    let target: ResourceDrawer2d<Texture>;
    let handle: ResourceHandle<Texture>;
    let atlas: Atlas;
    let sprite: SpriteAnimated<Texture>;

    beforeEach(() => {
        atlas = createAtlas();
        handle = TextureManager.add("http://example.com/test.png");
        spyDraw = jest.fn();
        target = {
            drawResource: spyDraw,
        };
        sprite = new SpriteAnimated<Texture>(handle, atlas);
    });

    it("throws with unknown animation", () =>
        expect(() => {
            sprite.draw(target, {
                animationName: "unknown",
                time: 0,
                dest: vec2(0, 0),
            });
        }).toThrowErrorMatchingInlineSnapshot(`"Unknown animation \\"unknown\\""`));

    describe("draw without source", () => {
        beforeEach(() => {
            sprite.draw(target, {
                animationName: "default",
                time: 0,
                dest: vec2(10, 15),
            });
        });

        it("calls draw as expected", () => expect(spyDraw).toHaveBeenCalledWith({
            handle,
            src: rect(0, 0, 8, 8),
            dest: rect(10, 15, 8, 8),
        }));
    });

    describe("draw with source vector", () => {
        beforeEach(() => {
            sprite.draw(target, {
                animationName: "default",
                time: 110,
                src: vec2(5, 5),
                dest: vec2(10, 15),
            });
        });

        it("calls draw as expected", () =>
            expect(spyDraw).toHaveBeenCalledWith({
                handle,
                src: rect(13, 5, 3, 3),
                dest: rect(10, 15, 3, 3),
            }));
    });

    describe("draw with source rect", () => {
        beforeEach(() => {
            sprite.draw(target, {
                animationName: "default",
                time: 110,
                src: rect(5, 0, 2, 8),
                dest: vec2(10, 15),
            });
        });

        it("calls draw as expected", () =>
            expect(spyDraw).toHaveBeenCalledWith({
                handle,
                src: rect(13, 0, 2, 8),
                dest: rect(10, 15, 2, 8),
            }));
    });

    describe("draw with destination rect", () => {
        beforeEach(() => {
            sprite.draw(target, {
                animationName: "default",
                time: 110,
                src: rect(5, 0, 2, 8),
                dest: rect(10, 15, 10, 10),
            });
        });

        it("calls draw as expected", () =>
            expect(spyDraw).toHaveBeenCalledWith({
                handle,
                src: rect(13, 0, 2, 8),
                dest: rect(10, 15, 10, 10),
            }));
    });
});
