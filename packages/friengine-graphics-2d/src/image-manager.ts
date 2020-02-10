import { ResourceManager, Resource, DoneResource, ResourceHandle } from "friengine-core";
import { LoadImage, loadImage as defaultLoadImage } from "./utils";

export interface ImageManagerOptions {
    loadImage?: LoadImage;
}

export class ImageManager {
    static RESOURCE_TYPE = Symbol("ResourceTypeImage");

    public static add(url: string, loadImage: LoadImage = defaultLoadImage): ResourceHandle<HTMLImageElement> {
        return ResourceManager.add({
            type: this.RESOURCE_TYPE,
            load: () => loadImage(url),
        });
    }

    constructor(private resourceManager: ResourceManager, private options: ImageManagerOptions = {}) {}

    public async waitUntilFinished(): Promise<DoneResource<HTMLImageElement>[]> {
        return await Promise.all(
            this.resourceManager
                .search({ type: ImageManager.RESOURCE_TYPE })
                .map(resource => this.resourceManager.waitFor<HTMLImageElement>(resource)),
        );
    }

    public get<HTMLImageElement>(resourceHandle: ResourceHandle<HTMLImageElement>): HTMLImageElement {
        return this.resourceManager.get(resourceHandle);
    }

    public getResource<HTMLImageElement>(resourceHandle: ResourceHandle<HTMLImageElement>): Resource<HTMLImageElement> {
        return this.resourceManager.getResource(resourceHandle);
    }

    public load<HTMLImageElement>(handle: ResourceHandle<HTMLImageElement>): Resource<HTMLImageElement> {
        return this.resourceManager.load(handle);
    }
}
