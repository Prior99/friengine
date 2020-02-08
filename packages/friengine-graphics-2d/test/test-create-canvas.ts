import { createCanvas } from "../src";

describe("createCanvas", () => {
    let canvas: HTMLCanvasElement;

    beforeEach(() => canvas = createCanvas(100, 50));

    it("creates a canvas element", () => expect(canvas.tagName).toBe("CANVAS"));

    it("sets width", () => expect(canvas.width).toBe(100));

    it("sets height", () => expect(canvas.height).toBe(50));
});