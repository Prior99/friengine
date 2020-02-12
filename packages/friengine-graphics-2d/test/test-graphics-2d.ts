import { ResourceManager, vec2, ResourceHandle } from "friengine-core";
import { Graphics2d, TextureManager, ImageManager, Texture } from "../src";
import { toPng, createGl, loadImage } from "./utils";
import * as path from "path";

describe("Graphics2d", () => {
    let graphics2d: Graphics2d;
    let gl: WebGL2RenderingContext;
    let resourceManager: ResourceManager;
    let imageManager: ImageManager;
    let textureManager: TextureManager;
    let textureHandle: ResourceHandle<Texture>;

    beforeEach(async () => {
        gl = createGl();
        resourceManager = new ResourceManager();
        imageManager = new ImageManager(resourceManager, { loadImage });
        textureManager = new TextureManager(resourceManager, imageManager, gl);
        graphics2d = new Graphics2d(gl, textureManager, { width: 320, height: 240 });

        textureHandle = TextureManager.add(path.join(__dirname, "assets", "test.png"));
        textureManager.load(textureHandle);
        await resourceManager.waitUntilFinished();
    });

    describe("rendering a texture", () => {
        beforeEach(() => {
            graphics2d.render(() => {
                graphics2d.drawTexture({
                    textureHandle,
                    destPosition: vec2(10, 20),
                    srcPosition: vec2(10, 10),
                    srcDimensions: vec2(44, 44),
                });
            });
        });

        it("matches the snapshot", () => {
            expect(toPng(gl)).toMatchImageSnapshot();
        });
    });
});
