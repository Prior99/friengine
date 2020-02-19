import { SpriteTile } from "../src";
import { createTestDrawer, TestDrawer } from "friengine-test-utils";
import { ResourceHandle, rect, vec2 } from "friengine-core";

describe("SpriteTile", () => {
    let sprite: SpriteTile<string>;
    let drawer: TestDrawer;
    let handle: ResourceHandle<string>;

    beforeEach(() => {
        drawer = createTestDrawer();
        handle = { symbol: Symbol() };
        sprite = new SpriteTile(handle, rect(1, 2, 30, 40));
    });

    describe("when drawing", () => {
        const options = {
            src: rect(10, 20, 50, 50),
            dest: vec2(12, 15),
        };

        beforeEach(() => sprite.draw(drawer, options));

        it("calls draw as expected", () => expect(drawer.drawResource).toHaveBeenCalledWith({
            handle,
            src: rect(11, 22, 20, 20),
            dest: rect(12, 15, 20, 20),
        }));
    });
});