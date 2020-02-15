import { SpriteSimple, ResourceDrawer2d } from "friengine-graphics-2d";
import { Texture, TextureManager } from "friengine-graphics";
import { ResourceHandle, vec2, rect } from "friengine-core";

describe("SpriteSimple", () => {
    let spyDraw: jest.MockedFunction<any>;
    let target: ResourceDrawer2d<Texture>;
    let handle: ResourceHandle<Texture>;
    let sprite: SpriteSimple<Texture>;

    beforeEach(() => {
        handle = TextureManager.add("http://example.com/test.png");
        spyDraw = jest.fn();
        target = {
            drawResource: spyDraw,
        };
        sprite = new SpriteSimple<Texture>(handle);
    });

    describe("draw", () => {
        beforeEach(() => {
            sprite.draw(target, {
                dest: vec2(10, 15),
            });
        });

        it("calls draw as expected", () => expect(spyDraw).toHaveBeenCalledWith({
            handle,
            dest: vec2(10, 15),
        }));
    });
});
