import { ResourceManager, Resource, DoneResource, ResourceHandle, createSpecificResourceManager } from "friengine-core";
import { ImageManager } from "./image-manager";
export interface TextureManagerOptions {
    gl: WebGL2RenderingContext;
}

export interface TextureLoadOptions {
    imageHandle: ResourceHandle<HTMLImageElement>;
}

export const RESOURCE_TYPE_TEXTURE = Symbol("ResourceTypeTexture");

export const textureManagerConfig = createSpecificResourceManager<WebGLTexture, TextureLoadOptions>(
    RESOURCE_TYPE_TEXTURE,
);

export class TextureManager extends textureManagerConfig.superClass {
    static add(url: string): ResourceHandle<HTMLImageElement> {
        const imageHandle = ImageManager.add(url);
        return textureManagerConfig.add({
            options: { imageHandle },
            dependencies: [imageHandle],
        });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return textureManagerConfig.allHandles();
    }

    constructor(
        resourceManager: ResourceManager,
        private imageManager: ImageManager,
        private options: TextureManagerOptions,
    ) {
        super(resourceManager);
    }

    private async loadTexture({ imageHandle }: TextureLoadOptions): Promise<WebGLTexture> {
        const image = this.imageManager.get(imageHandle);
        const { gl } = this.options;
        const texture = gl.createTexture();
        if (texture === null) {
            throw new Error("Failed to create new texture.");
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    public load(handle: ResourceHandle<WebGLTexture>): Resource<WebGLTexture> {
        return super.load(handle, options => this.loadTexture(options));
    }

    public async loadAll(): Promise<DoneResource<WebGLTexture>[]> {
        return super.loadAll(options => this.loadTexture(options));
    }
}
