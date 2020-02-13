import {
    ResourceManager,
    ResourceHandle,
    BaseSpecificResourceManager,
    SpecificResourceManager,
    LoadResult,
    LoadResultStatus,
} from "friengine-core";
import { Sprite } from "./sprite";
import { SpriteSimple } from "./sprite-simple";

export const RESOURCE_TYPE_SPRITE = Symbol("ResourceTypeSprite");

export enum SpriteType {
    SIMPLE = "simple",
}

export interface SpriteLoadOptions {
    url: string;
    type: SpriteType;
}

interface SpriteMeta<TResource> {
    drawableHandle?: ResourceHandle<TResource>;
}

export class SpriteManager<TResource> extends BaseSpecificResourceManager<
    SpriteLoadOptions,
    Sprite<TResource>,
    SpriteMeta<TResource>
> {
    static addSimple<TResource>(url: string): ResourceHandle<SpriteSimple<TResource>> {
        return ResourceManager.add({
            type: RESOURCE_TYPE_SPRITE,
            options: { url, type: SpriteType.SIMPLE },
        });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_SPRITE);
    }

    protected readonly resourceType = RESOURCE_TYPE_SPRITE;

    constructor(
        resourceManager: ResourceManager,
        private drawableManager: SpecificResourceManager<TResource>,
        private createDrawableHandle: (url: string) => ResourceHandle<TResource>,
    ) {
        super(resourceManager);
    }

    private loaderSpriteSimple(url: string, handle: ResourceHandle<Sprite<TResource>>): LoadResult<Sprite<TResource>> {
        const meta = this.meta.get(handle.symbol);
        if (meta && meta.drawableHandle && this.resourceManager.resourceDone(meta.drawableHandle)) {
            this.meta.delete(handle.symbol);
            return {
                status: LoadResultStatus.SUCCESS,
                data: new SpriteSimple(meta.drawableHandle),
            };
        }
        const drawableHandle = this.createDrawableHandle(url);
        this.meta.set(handle.symbol, { drawableHandle });

        this.drawableManager.load(drawableHandle);
        return {
            status: LoadResultStatus.DEFERRED,
            dependencies: [drawableHandle],
        };
    }

    protected async loader(
        { url, type }: SpriteLoadOptions,
        handle: ResourceHandle<Sprite<TResource>>,
    ): Promise<LoadResult<Sprite<TResource>>> {
        switch (type) {
            case SpriteType.SIMPLE:
                return this.loaderSpriteSimple(url, handle);
        }
    }
}
