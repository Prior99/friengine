import { ResourceHandle, vec2, rect } from "friengine-core";
import { GraphicsLayer2d, SpriteSimple, SpriteManager } from "../src";
import { Graphics, Texture } from "friengine-graphics";
import { toPng, createTestGraphics } from "friengine-test-utils";
import * as path from "path";
import { SpriteAnimated } from "friengine-graphics-2d";
import { parseAsepriteAtlas } from "friengine-aseprite";

describe("GraphicsLayer2d", () => {
    let graphics: Graphics;
    let gl: WebGL2RenderingContext;
    let spriteManager: SpriteManager<Texture>;

    beforeEach(() => {
        const parts = createTestGraphics();
        gl = parts.gl;
        spriteManager = parts.spriteManager;
        graphics = parts.graphics;
    });

    describe("simple sprite circle", () => {
        let testLayer: TestLayer;
        let handle: ResourceHandle<SpriteSimple<Texture>>;
        let sprite: SpriteSimple<Texture>;
        class TestLayer extends GraphicsLayer2d {
            public render(): void {
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
                    const x = 80 * Math.cos(a);
                    const y = 80 * Math.sin(a);
                    sprite.draw(this, {
                        dest: vec2(x, y).add(vec2(128, 88)),
                        src: rect(10, 10, 44, 44),
                    });
                }
            }
        }

        beforeEach(async () => {
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

    describe("animated sprites", () => {
        let testLayer: TestLayer;
        let handle: ResourceHandle<SpriteAnimated<Texture>>;
        let sprite: SpriteAnimated<Texture>;

        class TestLayer extends GraphicsLayer2d {
            public render(): void {
                for (let time = 0, x = 0; time < 800; time += 100, x += 38) {
                    sprite.draw(this, {
                        animationName: "0to2",
                        time,
                        dest: vec2(x, 0),
                    });
                    sprite.draw(this, {
                        animationName: "3to0",
                        time,
                        dest: vec2(x, 40),
                    });
                    sprite.draw(this, {
                        animationName: "0to3to0",
                        time,
                        dest: vec2(x, 80),
                        src: vec2(4, 4),
                    });
                    sprite.draw(this, {
                        animationName: "3to0",
                        time,
                        dest: vec2(x, 120),
                        src: rect(4, 4, 28, 28),
                    });
                }
            }
        }

        beforeEach(async () => {
            testLayer = new TestLayer();
            graphics.addLayer(testLayer);

            handle = SpriteManager.addAnimated(
                path.join(__dirname, "assets", "digits.json"),
                parseAsepriteAtlas,
            );
            spriteManager.load(handle);
            await spriteManager.waitUntilFinished();
            sprite = spriteManager.get(handle);
        });

        describe("after rendering", () => {
            beforeEach(() => graphics.render());

            it("matches the snapshot", () => expect(toPng(gl)).toMatchImageSnapshot());
        });
    });
});
