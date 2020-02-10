import * as utils from "../src/utils";
import { ImageManager, LoadImage } from "../src";
import { ResourceManager, ResourceHandle } from "friengine-core";

describe("ImageManager", () => {
    let imageManager: ImageManager;
    let resourceManager: ResourceManager;

    describe("with overridden loadImage method", () => {
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
            spyResourceManagerAdd = jest.spyOn(ResourceManager, "add");
            jest.spyOn(resourceManager, "waitFor");
            imageManager = new ImageManager(resourceManager, { loadImage });
        });

        describe("after adding 3 working images", () => {
            const urls = [
                "http://example.com/image1.jpg",
                "http://example.com/image2.jpg",
                "http://example.com/image3.jpg",
            ];

            let handles: ResourceHandle<HTMLImageElement>[];

            beforeEach(() => {
                spyResourceManagerAdd.mockClear();
                ResourceManager.reset();
                handles = urls.map(url => ImageManager.add(url));
            });

            it("knows all handles", () => expect(ImageManager.allHandles).toEqual(handles));

            it("called add on the ResourceManager 3 times", () =>
                expect(spyResourceManagerAdd).toHaveBeenCalledTimes(3));

            describe("after loading the images", () => {
                beforeEach(async () => await imageManager.loadAll());

                it("calls loadImage with each url", () =>
                    expect(loadImage.mock.calls).toEqual([...urls.map(url => [url])]));

                it("can wait for the images to load", async () =>
                    expect((await imageManager.waitUntilFinished()).map(resource => resource.data.src)).toEqual(urls));

                it("can get an image", async () => expect(await imageManager.get(handles[0]).src).toBe(urls[0]));

                it("can get an image resource", async () =>
                    expect(await imageManager.getResource(handles[0]).symbol).toBe(handles[0].symbol));
            });
        });

        describe("after adding images with erroneous urls", () => {
            const urls = ["http://example.com/image.jpg", "http://example.com/error.jpg"];
            beforeEach(() => {
                ResourceManager.reset();
                urls.forEach(url => imageManager.load(ImageManager.add(url)));
            });

            it("waiting for the images to load rejects", () =>
                expect(imageManager.waitUntilFinished()).rejects.toMatchInlineSnapshot(
                    `[Error: Failed to load image.]`,
                ));
        });
    });

    describe("with default loadImage method", () => {
        let spyLoadImage: jest.SpyInstance<any>;
        let handle: ResourceHandle<HTMLImageElement>;
        const url = "http://example.com/image1.jpg";

        beforeEach(async () => {
            resourceManager = new ResourceManager();
            spyLoadImage = jest.spyOn(utils, "loadImage").mockImplementation(async () => new Image());
            imageManager = new ImageManager(resourceManager);
            handle = ImageManager.add(url);
        });

        describe("when loading all at once", () => {
            beforeEach(async () => await imageManager.loadAll());

            it("called the default load image method", () => expect(spyLoadImage).toHaveBeenCalledWith(url));
        });

        describe("when loading individually", () => {
            beforeEach(async () => {
                imageManager.load(handle);
                await imageManager.waitUntilFinished();
            });

            it("called the default load image method", () => expect(spyLoadImage).toHaveBeenCalledWith(url));
        });
    });
});
