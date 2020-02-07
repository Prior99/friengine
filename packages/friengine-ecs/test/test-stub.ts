import { vec2, Vec2 } from "friengine-common";

describe("STUBS", () => {
    describe("operations on one vector", () => {
        let v: Vec2;

        beforeEach(() => v = vec2(10, 10));

        it("has the expected area", () => expect(v.area).toBe(100));
        it("has the expected max", () => expect(v.max).toBe(10));
    });
});