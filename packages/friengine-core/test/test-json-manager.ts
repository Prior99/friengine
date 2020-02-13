import { JsonManager } from "../src";
import { ResourceManager, ResourceHandle } from "friengine-core";

describe("JsonManager", () => {
    let jsonManager: JsonManager;
    let resourceManager: ResourceManager;

    describe("with overridden fetch", () => {
        let fetch: jest.MockedFunction<any>;
        let spyResourceManagerAdd: jest.SpyInstance<any>;

        beforeEach(() => {
            fetch = jest.fn(async (url: string) => ({
                json: async () => ({ some: "value", url }),
            }));
            resourceManager = new ResourceManager();
            spyResourceManagerAdd = jest.spyOn(ResourceManager, "add");
            jest.spyOn(resourceManager, "waitFor");
            jsonManager = new JsonManager(resourceManager, { fetch });
        });

        describe("after adding a resource", () => {
            const url = "http://example.com/example.json";
            let handle: ResourceHandle<unknown>;

            beforeEach(() => {
                spyResourceManagerAdd.mockClear();
                ResourceManager.reset();
                handle = JsonManager.add(url);
            });

            it("knows the handles", () => expect(JsonManager.allHandles).toEqual([handle]));

            it("called add on the ResourceManager", () => expect(spyResourceManagerAdd).toHaveBeenCalled());

            describe("after loading", () => {
                beforeEach(() => jsonManager.loadAll());

                it("calls fetch with the url", () => expect(fetch).toHaveBeenCalledWith(url));

                it("can wait for the images to load", async () =>
                    expect(
                        (await jsonManager.waitUntilFinished()).map(resource => (resource.data as any).url),
                    ).toEqual([url]));

                it("can get a json", async () =>
                    expect(await jsonManager.get(handle)).toEqual({
                        some: "value",
                        url,
                    }));
            });
        });
    });

    describe("with default fetch", () => {
        let spyFetch: jest.SpyInstance<any>;
        const url = "http://example.com/test.json";

        beforeEach(async () => {
            resourceManager = new ResourceManager();
            spyFetch = jest.fn(async () => ({ json: async () => ({}) } as any));
            window.fetch = spyFetch as any;
            jsonManager = new JsonManager(resourceManager);
            JsonManager.add(url);
            jsonManager.loadAll();
        });

        it("called the default load image method", () => expect(spyFetch).toHaveBeenCalledWith(url));
    });
});
