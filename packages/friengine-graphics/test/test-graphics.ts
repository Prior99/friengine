import { ResourceManager } from "friengine-core";
import { Graphics, TextureManager, ImageManager, GraphicsLayer } from "../src";
import { createGl, loadImage } from "friengine-test-utils";

describe("Graphics", () => {
    let graphics: Graphics;
    let gl: WebGL2RenderingContext;
    let resourceManager: ResourceManager;
    let imageManager: ImageManager;
    let textureManager: TextureManager;

    beforeEach(async () => {
        gl = createGl();
        resourceManager = new ResourceManager();
        imageManager = new ImageManager(resourceManager, { loadImage });
        textureManager = new TextureManager(resourceManager, imageManager, gl);
        graphics = new Graphics(gl, textureManager, { width: 320, height: 240 });
    });

    describe("after adding a layer", () => {
        class TestLayer extends GraphicsLayer {
            public render = jest.fn();
        }

        let testLayer: TestLayer;
        let spyRedraw: jest.SpyInstance<any>;

        beforeEach(() => {
            testLayer = new TestLayer();
            spyRedraw = jest.spyOn(testLayer, "redraw");
            graphics.addLayer(testLayer);
        });

        it("initialized the layer", () => expect(testLayer.initialized).toBe(true));

        describe("after rendering", () => {
            beforeEach(() => graphics.render());

            it("called render on the layer", () => expect(spyRedraw).toHaveBeenCalled());
        });
    });
});
