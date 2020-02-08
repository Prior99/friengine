import { numericalId } from "../src";

describe("numericalId", () => {
    let id1: number;
    let id2: number;

    beforeEach(() => {
        id1 = numericalId();
        id2 = numericalId();
    });

    it("id is a non-float number", () => expect(Math.floor(id1)).toBe(id1));

    it("id equals itself", () => expect(id1 === id1).toBe(true));

    it("id doesn't equal other id", () => expect(id1 === id2).toBe(false));
});