import { SpriteManager, SpriteSimple, SpriteAnimated } from "../src";
import { ResourceManager, ResourceHandle, JsonManager, rect } from "friengine-core";
import { TextureManager, ImageManager, Texture } from "friengine-graphics";
import { createGl, createAtlas } from "friengine-test-utils";
import { Atlas, AtlasParserStatus } from "friengine-atlas";

describe("SpriteManager", () => {
    let spriteManager: SpriteManager<Texture>;
    let jsonManager: JsonManager;
    let imageManager: ImageManager;
    let textureManager: TextureManager;
    let resourceManager: ResourceManager;
    let drawableHandle: ResourceHandle<Texture>;

    let spyCreateDrawableHandle: jest.MockedFunction<any>;
    let spyLoadDrawable: jest.SpyInstance<any>;

    beforeEach(() => {
        drawableHandle = TextureManager.add("http://example.com/some-url.png");
        spyCreateDrawableHandle = jest.fn(() => drawableHandle);

        const gl = createGl();
        resourceManager = new ResourceManager();
        jsonManager = new JsonManager(resourceManager, {
            fetch: jest.fn(
                async () =>
                    ({
                        json: async () => ({ some: "value" }),
                    } as any),
            ),
        });
        imageManager = new ImageManager(resourceManager, {
            loadImage: jest.fn(async () => ({ data: new Uint8Array(32 * 32 * 4), width: 32, height: 32 } as any)),
        });
        textureManager = new TextureManager(resourceManager, imageManager, gl);
        spriteManager = new SpriteManager(resourceManager, jsonManager, textureManager, spyCreateDrawableHandle);

        spyLoadDrawable = jest.spyOn(textureManager, "load");
    });

    describe("after adding and loading a simple sprite", () => {
        let handle: ResourceHandle<SpriteSimple<Texture>>;
        const someUrl = "http://example.com/test.png";

        beforeEach(() => {
            handle = SpriteManager.addSimple(someUrl);
            spriteManager.load(handle);
        });

        it("created the handle", () => expect(SpriteManager.allHandles).toHaveLength(1));

        it("knows the handle", () => expect(spriteManager.isKnownHandle(handle)).toBe(true));

        it("creates a drawable handle", () => expect(spyCreateDrawableHandle).toHaveBeenCalledWith(someUrl));

        describe("after waiting for the sprite to finish loading", () => {
            beforeEach(() => spriteManager.waitUntilFinished());

            it("calls load on the texture manager", () => expect(spyLoadDrawable).toHaveBeenCalledWith(drawableHandle));

            it("has the sprite available", () =>
                expect(spriteManager.get(handle)).toEqual(new SpriteSimple(drawableHandle)));
        });
    });

    describe("after adding and loading an animated sprite", () => {
        let handle: ResourceHandle<SpriteSimple<Texture>>;
        const someUrl = "http://example.com/test.png";
        let atlas: Atlas;
        let jsonHandle: ResourceHandle<unknown>;

        let spyAtlasParser: jest.MockedFunction<any>;
        let spyCreateJsonHandle: jest.SpyInstance<any>;
        let spyLoadJson: jest.SpyInstance<any>;

        describe("with atlas parser success", () => {
            beforeEach(() => {
                jsonHandle = JsonManager.add("http://example.com/something.json");
                spyLoadJson = jest.spyOn(jsonManager, "load");
                spyCreateJsonHandle = jest.spyOn(JsonManager, "add").mockImplementation(() => jsonHandle);
                atlas = createAtlas();
                spyAtlasParser = jest.fn(() => ({ status: AtlasParserStatus.SUCCESS, atlas }));
                handle = SpriteManager.addAnimated(someUrl, spyAtlasParser);
                spriteManager.load(handle);
            });

            it("knows the handle", () => expect(spriteManager.isKnownHandle(handle)).toBe(true));

            it("creates a json handle", () => expect(spyCreateJsonHandle).toHaveBeenCalledWith(someUrl));

            describe("after waiting for the sprite to finish loading", () => {
                beforeEach(() => spriteManager.waitUntilFinished());

                it("calls load on the json manager", () => expect(spyLoadJson).toHaveBeenCalledWith(jsonHandle));

                it("calls the atlas parser", () => expect(spyAtlasParser).toHaveBeenCalledWith({ some: "value" }));

                it("calls load on the json manager", () => expect(spyLoadJson).toHaveBeenCalledWith(jsonHandle));

                it("has the sprite available", () =>
                    expect(spriteManager.get(handle)).toEqual(new SpriteAnimated(drawableHandle, atlas)));
            });
        });

        describe("with the atlas parser failing", () => {
            beforeEach(() => {
                jsonHandle = JsonManager.add("http://example.com/something.json");
                spyLoadJson = jest.spyOn(jsonManager, "load");
                spyAtlasParser = jest.fn(() => ({ status: AtlasParserStatus.ERROR }));
                handle = SpriteManager.addAnimated(someUrl, spyAtlasParser);
                spriteManager.load(handle);
            });

            it("rejects on load", () =>
                expect(spriteManager.waitUntilFinished()).rejects.toMatchInlineSnapshot(
                    `[Error: Unable to parse atlas.]`,
                ));
        });
    });
});
