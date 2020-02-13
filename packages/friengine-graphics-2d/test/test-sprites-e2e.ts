import { ResourceHandle, vec2 } from "friengine-core";
import { GraphicsLayer2d, SpriteSimple, SpriteManager } from "../src";
import { Graphics, Texture } from "friengine-graphics";
import { toPng, createTestGraphics } from "friengine-test-utils";
import * as path from "path";

describe("GraphicsLayer2d", () => {
    let graphics: Graphics;
    let testLayer: TestLayer;
    let handle: ResourceHandle<Texture>;
    let gl: WebGL2RenderingContext;
    let sprite: SpriteSimple<Texture>;
    let spriteManager: SpriteManager<Texture>;

    class TestLayer extends GraphicsLayer2d {
        public render(): void {
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
                const x = 80 * Math.cos(a);
                const y = 80 * Math.sin(a);
                sprite.draw(this, {
                    destPosition: vec2(x, y).add(vec2(128, 88)),
                    srcPosition: vec2(10, 10),
                    srcDimensions: vec2(44, 44),
                });
            }
        }
    }

    beforeEach(async () => {
        const parts = createTestGraphics();
        gl = parts.gl;
        spriteManager = parts.spriteManager;
        graphics = parts.graphics;
        testLayer = new TestLayer();
        graphics.addLayer(testLayer);

        handle = SpriteManager.addSimple(path.join(__dirname, "assets", "test.png"));
        spriteManager.load(handle);
        await spriteManager.waitUntilFinished();
        sprite = spriteManager.get(handle);
    });

    describe("after rendering", () => {
        beforeEach(() => graphics.render());

        it("matches the snapshot", () => expect(toPng(gl)).toMatchImageSnapshot());
    });
});
