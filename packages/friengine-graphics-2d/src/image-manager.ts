import { ResourceManager, Resource, DoneResource, ResourceHandle, createSpecificResourceManager } from "friengine-core";
import { LoadImage, loadImage as defaultLoadImage } from "./utils";

export interface ImageManagerOptions {
    loadImage?: LoadImage;
}

export interface ImageLoadOptions {
    url: string;
}

export const RESOURCE_TYPE_IMAGE = Symbol("ResourceTypeImage");

export const imageManagerConfig = createSpecificResourceManager<HTMLImageElement, ImageLoadOptions>(RESOURCE_TYPE_IMAGE);

export class ImageManager extends imageManagerConfig.superClass {
    static add(url: string): ResourceHandle<HTMLImageElement> {
        return imageManagerConfig.add({ options: { url } });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return imageManagerConfig.allHandles();
    }

    constructor(resourceManager: ResourceManager, private options: ImageManagerOptions = {}) {
        super(resourceManager);
    }

    private get loadImage(): LoadImage {
        return this.options.loadImage ?? defaultLoadImage;
    }

    public load(handle: ResourceHandle<HTMLImageElement>): Resource<HTMLImageElement> {
        return super.load(handle, ({ url }: ImageLoadOptions) => this.loadImage(url));
    }

    public async loadAll(): Promise<DoneResource<HTMLImageElement>[]> {
        return super.loadAll(({ url }: ImageLoadOptions) => this.loadImage(url));
    }
}
