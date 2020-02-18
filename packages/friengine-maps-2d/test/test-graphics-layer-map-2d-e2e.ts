import { Map2d, GraphicsLayerMap2d } from "../src";
import { Graphics, Texture } from "friengine-graphics";
import { SpriteManager } from "friengine-graphics-2d";
import { toPng, createTestGraphics, createMap } from "friengine-test-utils";

describe("GraphicsLayerMap2d", () => {
    let graphics: Graphics;
    let gl: WebGL2RenderingContext;
    let spriteManager: SpriteManager<Texture>;
    let map: Map2d<Texture>;
    let testLayer: GraphicsLayerMap2d;

    beforeEach(async () => {
        const parts = createTestGraphics();
        gl = parts.gl;
        spriteManager = parts.spriteManager;
        graphics = parts.graphics;
        map = createMap();
        spriteManager.loadAll();
        testLayer = new GraphicsLayerMap2d(map, spriteManager);
        graphics.addLayer(testLayer);
        await parts.resourceManager.waitUntilFinished();
    });

    describe("after rendering", () => {
        beforeEach(() => graphics.render());

        it("matches the snapshot", () => expect(toPng(gl)).toMatchImageSnapshot());
    });
});
