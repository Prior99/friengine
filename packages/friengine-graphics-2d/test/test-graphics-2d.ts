import { Graphics2d } from "../src";
import { toPng, createGl } from "./utils";

describe("Graphics2d", () => {
    let graphics2d: Graphics2d;
    let gl: WebGL2RenderingContext;

    beforeEach(() => {
        gl = createGl();
        graphics2d = new Graphics2d(gl);
    });

    describe("after rendering", () => {
        beforeEach(() => graphics2d.render());

        it("matches the snapshot", () => {
            expect(toPng(gl)).toMatchImageSnapshot();
        });
    });
});
