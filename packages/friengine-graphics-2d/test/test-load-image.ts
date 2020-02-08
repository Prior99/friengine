import { loadImage } from "../src";

describe("loadImage", () => {
    const url = "http://example.com/image.jpg";

    describe("with the image loading successfully", () => {
        let error: Error | undefined = undefined;
        beforeEach(() => {
            jest.spyOn(Image.prototype, "addEventListener").mockImplementation((name: any, callback: any) => {
                // eslint-disable-line
                if (name === "error") {
                    callback(new Error("Oops!"));
                }
            });
            loadImage(url).catch(err => (error = err));
        });

        it("rejected", () => expect(error).toMatchInlineSnapshot(`[Error: Oops!]`));
    });

    describe("with the image loading successfully", () => {
        let image: HTMLImageElement | undefined = undefined;
        beforeEach(() => {
            jest.spyOn(Image.prototype, "addEventListener").mockImplementation((name: any, callback: any) => {
                // eslint-disable-line
                if (name === "load") {
                    callback();
                }
            });
            loadImage(url).then(result => (image = result));
        });

        it("resolved", () => expect(image).toEqual(expect.any(HTMLImageElement)));
    });
});
