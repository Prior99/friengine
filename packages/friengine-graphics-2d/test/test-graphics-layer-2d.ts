import { ResourceManager, ResourceHandle, vec2, rect } from "friengine-core";
import { GraphicsLayer2d } from "../src";
import { Graphics, TextureManager, Texture } from "friengine-graphics";
import { toPng, createTestGraphics } from "friengine-test-utils";
import * as path from "path";

describe("GraphicsLayer2d", () => {
    let graphics: Graphics;
    let resourceManager: ResourceManager;
    let textureManager: TextureManager;
    let testLayer: TestLayer;
    let handle: ResourceHandle<Texture>;
    let gl: WebGL2RenderingContext;

    class TestLayer extends GraphicsLayer2d {
        public render(): void {
            this.drawResource({
                handle,
                dest: vec2(10, 20),
                src: rect(10, 10, 44, 44)
            });
            this.drawResource({
                handle,
                dest: vec2(100, 50),
            });
            this.drawResource({
                handle,
                dest: vec2(50, 40),
            });
        }
    }

    beforeEach(async () => {
        const parts = createTestGraphics();
        gl = parts.gl;
        resourceManager = parts.resourceManager;
        textureManager = parts.textureManager;
        graphics = parts.graphics;
        testLayer = new TestLayer();
        graphics.addLayer(testLayer);

        handle = TextureManager.add(path.join(__dirname, "assets", "test.png"));
        textureManager.load(handle);
        await resourceManager.waitUntilFinished();
    });

    describe("after rendering", () => {
        beforeEach(() => graphics.render());

        it("matches the snapshot", () => expect(toPng(gl)).toMatchImageSnapshot());
    });
});
