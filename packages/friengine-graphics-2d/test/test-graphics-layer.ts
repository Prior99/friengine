import { GraphicsLayer, GraphicsLayerOptions, TextureManager, ImageManager } from "friengine-graphics";
import { Constructable, ResourceManager } from "friengine-core";
import { createGl } from "friengine-test-utils";

describe("GraphicsLayer", () => {
    let testLayerClass: Constructable<GraphicsLayer>;
    let graphicsLayer: GraphicsLayer;
    let spyRender: jest.MockedFunction<any>;

    beforeEach(() => {
        spyRender = jest.fn();
        testLayerClass = class extends GraphicsLayer {
            render = spyRender;
        };
        graphicsLayer = new testLayerClass();
    });

    it("throws when calling redraw", () =>
        expect(() => graphicsLayer.redraw()).toThrowErrorMatchingInlineSnapshot(
            `"Tried to redraw an uninitialized layer."`,
        ));

    it("isn't initialized", () => expect(graphicsLayer.initialized).toBe(false));

    describe("after initializing", () => {
        let gl: WebGL2RenderingContext;
        let options: GraphicsLayerOptions;
        let textureManager: TextureManager;
        let resourceManager: ResourceManager;

        beforeEach(() => {
            gl = createGl();
            options = { width: 10, height: 10 };
            resourceManager = new ResourceManager();
            textureManager = new TextureManager(resourceManager, new ImageManager(resourceManager), gl);
            graphicsLayer.initialize(gl, textureManager, options);
        });

        it("is initialized", () => expect(graphicsLayer.initialized).toBe(true));

        describe("after calling redraw", () => {
            beforeEach(() => graphicsLayer.redraw());

            it("calls render", () => expect(spyRender).toHaveBeenCalled());
        });
    });
});
