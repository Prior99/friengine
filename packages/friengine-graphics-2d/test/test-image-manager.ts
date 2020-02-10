import { ImageManager, LoadImage } from "../src";
import { ResourceManager } from "friengine-core";

describe("ImageManager", () => {
    let imageManager: ImageManager;
    let resourceManager: ResourceManager;
    let loadImage: jest.MockedFunction<LoadImage>;
    let spyResourceManagerAdd: jest.SpyInstance<any>;

    beforeEach(() => {
        loadImage = jest.fn(async (url: string) => {
            if (url.includes("error")) {
                throw new Error("Failed to load image.");
            }
            const img = new Image();
            img.src = url;
            return img;
        });
        resourceManager = new ResourceManager();
        spyResourceManagerAdd = jest.spyOn(resourceManager, "add");
        jest.spyOn(resourceManager, "waitFor");
        imageManager = new ImageManager(resourceManager, { loadImage });
    });

    describe("after adding 3 working images", () => {
        const urls = [
            "http://example.com/image1.jpg",
            "http://example.com/image2.jpg",
            "http://example.com/image3.jpg",
        ];
        beforeEach(() => urls.forEach(url => imageManager.add(url)));

        it("called add on the ResourceManager 3 times", () => expect(spyResourceManagerAdd).toHaveBeenCalledTimes(3));

        it("calls loadImage with each url", () => expect(loadImage.mock.calls).toEqual([...urls.map(url => [url])]));

        it("can wait for the images to load", async () =>
            expect((await imageManager.waitUntilFinished()).map(resource => resource.data.src)).toEqual(urls));
    });

    describe("after adding images with erroneous urls", () => {
        const urls = ["http://example.com/image.jpg", "http://example.com/error.jpg"];
        beforeEach(() => urls.forEach(url => imageManager.add(url)));

        it("waiting for the images to load rejects", () =>
            expect(imageManager.waitUntilFinished()).rejects.toMatchInlineSnapshot(`[Error: Failed to load image.]`));
    });
});
