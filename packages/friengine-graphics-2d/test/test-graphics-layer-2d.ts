import { ResourceManager, ResourceHandle, vec2 } from "friengine-core";
import { GraphicsLayer2d } from "../src";
import { Graphics, ImageManager, TextureManager, Texture } from "friengine-graphics";
import { createGl, loadImage, toPng } from "friengine-test-utils";
import * as path from "path";

describe("Graphics", () => {
    let graphics: Graphics;
    let gl: WebGL2RenderingContext;
    let resourceManager: ResourceManager;
    let imageManager: ImageManager;
    let textureManager: TextureManager;
    let testLayer: TestLayer;
    let textureHandle: ResourceHandle<Texture>;

    class TestLayer extends GraphicsLayer2d {
        public render(): void {
            this.drawTexture({
                textureHandle,
                destPosition: vec2(10, 20),
                srcPosition: vec2(10, 10),
                srcDimensions: vec2(44, 44),
            });
            this.drawTexture({
                textureHandle,
                destPosition: vec2(100, 50),
            });
            this.drawTexture({
                textureHandle,
                destPosition: vec2(50, 40),
            });
        }
    }

    beforeEach(async () => {
        gl = createGl();
        resourceManager = new ResourceManager();
        imageManager = new ImageManager(resourceManager, { loadImage });
        textureManager = new TextureManager(resourceManager, imageManager, gl);
        graphics = new Graphics(gl, textureManager, { width: 320, height: 240 });
        testLayer = new TestLayer();
        graphics.addLayer(testLayer);

        textureHandle = TextureManager.add(path.join(__dirname, "assets", "test.png"));
        textureManager.load(textureHandle);
        await resourceManager.waitUntilFinished();
    });

    describe("after rendering", () => {
        beforeEach(() => graphics.render());

        it("matches the snapshot", () => expect(toPng(gl)).toMatchImageSnapshot());
    });
});
