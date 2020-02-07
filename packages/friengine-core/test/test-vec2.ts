import { vec2, Vec2 } from "../src";

describe("vec2", () => {
    describe("operations on one vector", () => {
        let v: Vec2;

        beforeEach(() => v = vec2(10, 10));

        it("has the expected area", () => expect(v.area).toBe(100));
    });
});