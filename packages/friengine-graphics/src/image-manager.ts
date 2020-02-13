import { ResourceManager, ResourceHandle, BaseSpecificResourceManager } from "friengine-core";
import { LoadImage, loadImage as defaultLoadImage } from "./utils";

export interface ImageManagerOptions {
    loadImage?: LoadImage;
}

export interface ImageLoadOptions {
    url: string;
}

export const RESOURCE_TYPE_IMAGE = Symbol("ResourceTypeImage");

export class ImageManager extends BaseSpecificResourceManager<ImageLoadOptions, HTMLImageElement> {
    static add(url: string): ResourceHandle<HTMLImageElement> {
        return ResourceManager.add({
            type: RESOURCE_TYPE_IMAGE,
            options: { url },
        });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_IMAGE);
    }

    protected readonly resourceType = RESOURCE_TYPE_IMAGE;

    constructor(resourceManager: ResourceManager, private options: ImageManagerOptions = {}) {
        super(resourceManager);
    }

    private get loadImage(): LoadImage {
        return this.options.loadImage ?? defaultLoadImage;
    }

    protected loader({ url }: ImageLoadOptions): Promise<HTMLImageElement> {
        return this.loadImage(url);
    }
}
