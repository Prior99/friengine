import { ResourceManager, Resource, DoneResource } from "friengine-core";
import { LoadImage, loadImage } from "./utils";

export interface ImageManagerOptions {
    loadImage?: LoadImage;
}

export class ImageManager {
    static RESOURCE_TYPE = Symbol("ResourceTypeImage");

    constructor(private resourceManager: ResourceManager, private options: ImageManagerOptions = {}) {}

    private get loadImage(): LoadImage {
        return this.options.loadImage ?? loadImage;
    }

    public add(url: string): Resource<HTMLImageElement> {
        return this.resourceManager.add(ImageManager.RESOURCE_TYPE, {
            load: () => this.loadImage(url),
        });
    }

    public async waitUntilFinished(): Promise<DoneResource<HTMLImageElement>[]> {
        return await Promise.all(
            this.resourceManager
                .search({ type: ImageManager.RESOURCE_TYPE })
                .map(({ id }) => this.resourceManager.waitFor<HTMLImageElement>(id)),
        );
    }
}
