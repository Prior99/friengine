import { ResourceManager, ResourceHandle } from "friengine-core";
import { ImageManager, TextureManager, RESOURCE_TYPE_TEXTURE } from "../src";

describe("TextureManager", () => {
    let mockGl: WebGL2RenderingContext;
    let resourceManager: ResourceManager;
    let imageManager: ImageManager;
    let textureManager: TextureManager;
    let spyAddImage: jest.SpyInstance<any>;
    let spyAdd: jest.SpyInstance<any>;

    beforeEach(() => {
        mockGl = {
            createTexture: jest.fn(),
            bindTexture: jest.fn(),
            texImage2D: jest.fn(),
            texParameteri: jest.fn(),
            generateMipmap: jest.fn(),
        } as any;
        resourceManager = new ResourceManager();
        imageManager = new ImageManager(resourceManager, { loadImage: async () => new Image() });
        textureManager = new TextureManager(resourceManager, imageManager, { gl: mockGl });
        spyAddImage = jest.spyOn(ImageManager, "add");
        spyAdd = jest.spyOn(ResourceManager, "add");
    });

    describe("after adding a texture", () => {
        let handle: ResourceHandle<WebGLTexture>;
        const url = "http://example.com/image.jpg";

        beforeEach(() => {
            ResourceManager.reset();
            spyAdd.mockClear();
            handle = TextureManager.add(url);
        });

        it("adds an image", () => expect(spyAddImage).toHaveBeenCalledWith(url));

        it("adds a texture", () =>
            expect(spyAdd).toHaveBeenCalledWith({
                type: RESOURCE_TYPE_TEXTURE,
                dependencies: [{ symbol: expect.anything() }],
                options: { imageHandle: { symbol: expect.anything() } },
            }));

        it("knows the handle", () => expect(TextureManager.allHandles).toHaveLength(1));

        describe("with the webgl context not working", () => {
            beforeEach(() => (mockGl.createTexture as any).mockImplementation(() => null));

            describe("after loading the textures all at once", () => {
                beforeEach(async () => {
                    await imageManager.loadAll();
                });

                it("fails to load", () =>
                    expect(textureManager.loadAll()).rejects.toMatchInlineSnapshot(
                        `[Error: Failed to create new texture.]`,
                    ));
            });
        });

        describe("with the webgl context working", () => {
            const texture = {};

            beforeEach(() => (mockGl.createTexture as any).mockImplementation(() => texture));

            describe("after loading the textures all at once", () => {
                beforeEach(async () => {
                    await imageManager.loadAll();
                    await textureManager.loadAll();
                });

                it("calls createTexture", () => expect(mockGl.createTexture).toHaveBeenCalled());

                it("calls bindTexture", () => expect(mockGl.bindTexture).toHaveBeenCalled());

                it("calls texImage2D", () => expect(mockGl.texImage2D).toHaveBeenCalled());

                it("calls texParameteri", () => expect(mockGl.texParameteri).toHaveBeenCalled());

                it("calls generateMipmap", () => expect(mockGl.generateMipmap).toHaveBeenCalled());

                it("can get the texture", () => expect(textureManager.get(handle)).toBe(texture));
            });
        });
    });
});
