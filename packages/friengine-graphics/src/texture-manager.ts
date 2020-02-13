import {
    ResourceManager,
    ResourceHandle,
    BaseSpecificResourceManager,
    Resource,
    LoadResult,
    LoadResultStatus,
} from "friengine-core";
import { ImageManager } from "./image-manager";

export interface TextureLoadOptions {
    imageHandle: ResourceHandle<HTMLImageElement>;
}

export interface Texture {
    texture: WebGLTexture;
    imageHandle: ResourceHandle<HTMLImageElement>;
    width: number;
    height: number;
}

export const RESOURCE_TYPE_TEXTURE = Symbol("ResourceTypeTexture");

export class TextureManager extends BaseSpecificResourceManager<TextureLoadOptions, Texture> {
    static add(url: string): ResourceHandle<HTMLImageElement> {
        const imageHandle = ImageManager.add(url);
        return ResourceManager.add({
            type: RESOURCE_TYPE_TEXTURE,
            options: { imageHandle },
            dependencies: [imageHandle],
        });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_TEXTURE);
    }

    protected readonly resourceType = RESOURCE_TYPE_TEXTURE;

    constructor(
        resourceManager: ResourceManager,
        private imageManager: ImageManager,
        private gl: WebGL2RenderingContext,
    ) {
        super(resourceManager);
    }

    protected async loader({ imageHandle }: TextureLoadOptions): Promise<LoadResult<Texture>> {
        const image = this.imageManager.get(imageHandle);
        const { width, height } = image;
        const { gl } = this;
        const texture = gl.createTexture();
        if (texture === null) {
            throw new Error("Failed to create new texture.");
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return {
            status: LoadResultStatus.SUCCESS,
            data: {
                texture,
                width,
                height,
                imageHandle,
            },
        };
    }

    public load(handle: ResourceHandle<Texture>): Resource<Texture> {
        const resource = super.load(handle);
        this.imageManager.loadAllKnownHandles(resource.dependencies);
        return resource;
    }
}
