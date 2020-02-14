import {
    ResourceManager,
    ResourceHandle,
    BaseSpecificResourceManager,
    SpecificResourceManager,
    LoadResult,
    LoadResultStatus,
    JsonManager,
} from "friengine-core";
import { Sprite } from "./sprite";
import { SpriteSimple } from "./sprite-simple";
import { AtlasParser, Atlas, AtlasParserStatus } from "friengine-atlas";
import { SpriteAnimated } from "./sprite-animated";
import { resolve } from "url";

export const RESOURCE_TYPE_SPRITE = Symbol("ResourceTypeSprite");

export enum SpriteType {
    SIMPLE = "simple",
    ANIMATED = "animated",
}

export interface SpriteSimpleLoadOptions {
    url: string;
    type: SpriteType.SIMPLE;
}

export interface SpriteAnimatedLoadOptions {
    url: string;
    type: SpriteType.ANIMATED;
    atlasParser: AtlasParser;
}

export type SpriteLoadOptions = SpriteSimpleLoadOptions | SpriteAnimatedLoadOptions;

interface SpriteMeta<TResource> {
    drawableHandle?: ResourceHandle<TResource>;
    atlasJsonHandle?: ResourceHandle<unknown>;
    atlas?: Atlas;
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

    static addAnimated<TResource>(url: string, atlasParser: AtlasParser): ResourceHandle<SpriteSimple<TResource>> {
        return ResourceManager.add({
            type: RESOURCE_TYPE_SPRITE,
            options: { url, type: SpriteType.ANIMATED, atlasParser },
        });
    }

    static get allHandles(): ResourceHandle<HTMLImageElement>[] {
        return ResourceManager.getHandlesForType(RESOURCE_TYPE_SPRITE);
    }

    protected readonly resourceType = RESOURCE_TYPE_SPRITE;

    constructor(
        resourceManager: ResourceManager,
        private jsonManager: JsonManager,
        private drawableManager: SpecificResourceManager<TResource>,
        private createDrawableHandle: (url: string) => ResourceHandle<TResource>,
    ) {
        super(resourceManager);
    }

    private loaderSpriteAnimated(url: string, atlasParser: AtlasParser, handle: ResourceHandle<Sprite<TResource>>): LoadResult<Sprite<TResource>> {
        const meta = this.meta.get(handle.symbol);
        // Never called before. Load atlas.
        if (!meta) {
            const atlasJsonHandle = JsonManager.add(url);
            this.jsonManager.load(atlasJsonHandle);
            this.meta.set(handle.symbol, { atlasJsonHandle });
            return {
                status: LoadResultStatus.DEFERRED,
                dependencies: [atlasJsonHandle],
            };
        }
        const { atlasJsonHandle } = meta;
        // Atlas loaded, but drawable handle not.
        if (atlasJsonHandle && this.resourceManager.resourceDone(atlasJsonHandle) && !meta.drawableHandle) {
            const atlasParseResult = atlasParser(this.jsonManager.get(atlasJsonHandle));
            if (atlasParseResult.status === AtlasParserStatus.ERROR) {
                return {
                    status: LoadResultStatus.ERROR,
                    error: new Error("Unable to parse atlas."),
                };
            }
            const { atlas } = atlasParseResult;
            const drawableHandle = this.createDrawableHandle(resolve(url, atlas.relativeImageUrl));
            this.drawableManager.load(drawableHandle);
            this.meta.set(handle.symbol, { atlasJsonHandle, drawableHandle, atlas });
            return {
                status: LoadResultStatus.DEFERRED,
                dependencies: [drawableHandle],
            };
        }
        // All loaded.
        const { drawableHandle, atlas } = meta;
        return {
            status: LoadResultStatus.SUCCESS,
            data: new SpriteAnimated(drawableHandle!, atlas!),
        };
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
        options: SpriteLoadOptions,
        handle: ResourceHandle<Sprite<TResource>>,
    ): Promise<LoadResult<Sprite<TResource>>> {
        switch (options.type) {
            case SpriteType.SIMPLE:
                return this.loaderSpriteSimple(options.url, handle);
            case SpriteType.ANIMATED:
                return this.loaderSpriteAnimated(options.url, options.atlasParser, handle);
        }
    }
}
