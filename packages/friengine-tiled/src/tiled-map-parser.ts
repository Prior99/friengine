import { vec2, rect, Rect, Vec2 } from "friengine-core";
import { Map2dParserResult, Map2dParserStatus, Map2d, Map2dLayer, TileSet, DrawOrder } from "friengine-maps-2d";
import { isTiledMap, TiledMapRenderOrder } from "./tiled-map-types";
import {
    TiledLayerTiles,
    TiledLayerObjects,
    TiledLayerBase,
    TiledLayer,
    isTiledLayerObjects,
} from "./tiled-layer-types";

export function parseTiledRenderOrder(renderOrder: TiledMapRenderOrder): DrawOrder {
    switch (renderOrder) {
        case "right-up":
            return DrawOrder.RIGHT_UP;
        case "right-down":
            return DrawOrder.RIGHT_DOWN;
        case "left-up":
            return DrawOrder.LEFT_UP;
        case "left-down":
            return DrawOrder.LEFT_DOWN;
    }
}

export function getLayerTilesArea(layer: TiledLayerTiles): Rect {
    return rect(layer.x, layer.y, layer.width, layer.height);
}

export function getLayerObjectsArea(layer: TiledLayerObjects): Rect {
    const layerOffset = vec2(layer.x, layer.y);
    const topLeft = Vec2.min(...layer.objects.map(obj => vec2(obj.x, obj.y).add(layerOffset)));
    const bottomRight = Vec2.max(
        ...layer.objects.map(obj =>
            vec2(obj.x, obj.y)
                .add(vec2(obj.width, obj.height))
                .add(layerOffset),
        ),
    );
    const dimensions = bottomRight.sub(topLeft);
    return rect(topLeft, dimensions);
}

export function getLayerArea(layer: TiledLayer): Rect {
    if (isTiledLayerObjects(layer)) {
        return getLayerObjectsArea(layer);
    }
    return getLayerTilesArea(layer);
}

export function getCommonLayerArea(layer1?: TiledLayerTiles, layer2?: TiledLayerObjects): Rect {
    if (layer1 && layer2) {
        return getLayerArea(layer1).extend(getLayerArea(layer2));
    }
    if (layer1) {
        return getLayerArea(layer1);
    }
    if (layer2) {
        return getLayerArea(layer2!);
    }
    throw new Error("Must specify at least one layer.");
}

export function parseTiledLayer(tileLayer?: TiledLayerTiles, objectLayer?: TiledLayerObjects): Map2dLayer {
    const area = getCommonLayerArea(tileLayer, objectLayer);
    return new Map2dLayer(area);
}

export function parseTiledMap<TResource>(input: unknown): Map2dParserResult<TResource> {
    if (!isTiledMap(input)) {
        return { status: Map2dParserStatus.ERROR };
    }
    const dimensions = vec2(input.width, input.height);
    const tileDimensions = vec2(input.tilewidth, input.tileheight);
    const layers: Map2dLayer[] = [];
    const tileSets: TileSet<TResource>[] = [];
    const drawOrder = parseTiledRenderOrder(input.renderorder);
    return {
        status: Map2dParserStatus.SUCCESS,
        map: new Map2d(dimensions, tileDimensions, layers, tileSets, drawOrder),
    };
}
