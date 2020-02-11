import { ResourceManager } from "friengine-core";
import { Graphics2dParts, createGraphics2d, ImageManager, TextureManager, createCanvas } from "../src";

jest.mock("../src/image-manager");
jest.mock("../src/utils/create-canvas");
jest.mock("../src/graphics-2d", () => ({
    Graphics2d: class {},
}));

describe("createGraphics2d", () => {
    describe("with a functioning canvas", () => {
        let spyCreateCanvas: jest.SpyInstance<any>;

        beforeEach(() => {
            spyCreateCanvas = (createCanvas as jest.Mock).mockImplementation(
                (width: number, height: number) =>
                    ({
                        width,
                        height,
                        getContext: () => ({}),
                    } as any),
            );
        });

        describe("with image manager options", () => {
            const loadImage = (() => undefined) as any;

            beforeEach(() => createGraphics2d({ imageManagerOptions: { loadImage } }));

            it("passes through the options", () =>
                expect(ImageManager).toHaveBeenCalledWith(expect.any(ResourceManager), { loadImage }));
        });

        describe("with canvas options", () => {
            let parts: Graphics2dParts;

            beforeEach(() => parts = createGraphics2d({ canvasOptions: { width: 20, height: 10 } }));

            it("assigns the width", () => expect(parts.canvas.width).toBe(20));

            it("assigns the height", () => expect(parts.canvas.height).toBe(10));
        });

        describe("with canvas", () => {
            let parts: Graphics2dParts;
            let canvas: HTMLCanvasElement;

            beforeEach(() => {
                canvas = createCanvas(10, 10);
                spyCreateCanvas.mockClear();
                parts = createGraphics2d({ canvas });
            });

            it("uses the canvas", () => expect(parts.canvas).toBe(canvas));

            it("doesn't create a new canvas", () => expect(spyCreateCanvas).not.toHaveBeenCalled());
        });

        describe("with resource manager", () => {
            let parts: Graphics2dParts;
            let resourceManager: ResourceManager;

            beforeEach(() => {
                resourceManager = new ResourceManager();
                parts = createGraphics2d({ resourceManager });
            });

            it("uses the resource manager", () => expect(parts.resourceManager).toBe(resourceManager));
        });

        describe("with no arguments", () => {
            let parts: Graphics2dParts;

            beforeEach(() => parts = createGraphics2d());

            it("creates resource manager", () => expect(parts.resourceManager).toBeInstanceOf(ResourceManager));

            it("creates image manager", () => expect(parts.imageManager).toBeInstanceOf(ImageManager));

            it("creates texture manager", () => expect(parts.textureManager).toBeInstanceOf(TextureManager));

            it("creates canvas", () => expect(parts.canvas).toBeDefined());
        });
    });

    describe("with an unsupported canvas", () => {
        beforeEach(() => {
            (createCanvas as jest.Mock).mockImplementation(
                (width: number, height: number) =>
                    ({
                        width,
                        height,
                        getContext: () => null,
                    } as any),
            );
        });

        it("throws", () =>
            expect(() => createGraphics2d()).toThrowErrorMatchingInlineSnapshot(
                `"Unable to initialize WebGL context."`,
            ));
    });
});
