import { vec2, rect, Rect, Vec2 } from "friengine-core";
import {
    Map2dParserResult,
    Map2dParserStatus,
    Map2d,
    Map2dLayer,
    TileSet,
    DrawOrder,
    Map2dObject,
    Map2dShape,
} from "friengine-maps-2d";
import { isTiledMap, TiledMapRenderOrder } from "./tiled-map-types";
import { TiledLayerTiles, TiledLayerObjects, TiledLayer, isTiledLayerObjects } from "./tiled-layer-types";
import {
    TiledObject,
    isTiledObjectPoint,
    isTiledObjectEllipse,
    isTiledObjectRect,
    isTiledObjectPolygon,
} from "./tiled-object-types";

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

export function parseTiledLayerObjects(layer?: TiledLayerObjects): Map2dObject[] {
    if (!layer) {
        return [];
    }
    return layer.objects.map(obj => {
        const { visible, rotation, type, name, id } = obj;
        const base = { visible, rotation, type, name, id };
        if (isTiledObjectPolygon(obj)) {
            return {
                ...base,
                shape: Map2dShape.POLYGON,
                vertices: obj.polygon.map(({ x, y }) => vec2(x, y)),
            };
        }
        if (isTiledObjectPoint(obj)) {
            return {
                ...base,
                shape: Map2dShape.POINT,
                position: vec2(obj.x, obj.y),
            };
        }
        if (isTiledObjectEllipse(obj)) {
            return {
                ...base,
                shape: Map2dShape.ELLIPSE,
                area: rect(obj.x, obj.y, obj.width, obj.height),
            };
        }
        if (isTiledObjectRect(obj)) {
            return {
                ...base,
                shape: Map2dShape.RECTANGLE,
                area: rect(obj.x, obj.y, obj.width, obj.height),
            };
        }
        throw new Error("Unknown type of object.");
    });
}

export function parseTiledLayerTiles(area: Rect, layer?: TiledLayerTiles): number[] {
    if (!layer) {
        return [];
    }
    const result: number[] = [];
    const layerArea = rect(layer.x, layer.y, layer.width, layer.height);
    for (const position of area.positionIterator()) {
        if (layerArea.contains(position)) {
            result.push(layer.data[layerArea.toIndex(position)]);
            continue;
        }
        result.push(0);
    }
    return result;
}

export function parseTiledLayer(tileLayer?: TiledLayerTiles, objectLayer?: TiledLayerObjects): Map2dLayer {
    const area = getCommonLayerArea(tileLayer, objectLayer);
    const data: number[] = parseTiledLayerTiles(area, tileLayer);
    const objects: Map2dObject[] = parseTiledLayerObjects(objectLayer);
    return new Map2dLayer(area, data, objects);
}

export function parseTiledLayers(input: TiledLayer[]): Map2dLayer[] {
    const layers: Map2dLayer[] = [];
    for (let i = 0; i < input.length; ++i) {
        const currentLayer = input[i];
        if (isTiledLayerObjects(currentLayer)) {
            layers.push(parseTiledLayer(undefined, currentLayer));
            continue;
        }
        const nextLayer = input[i + 1];
        if (isTiledLayerObjects(nextLayer)) {
            layers.push(parseTiledLayer(currentLayer, nextLayer));
            i++;
            continue;
        }
        layers.push(parseTiledLayer(currentLayer));
    }
    return layers;
}

export function parseTiledMap<TResource>(input: unknown): Map2dParserResult<TResource> {
    if (!isTiledMap(input)) {
        return { status: Map2dParserStatus.ERROR };
    }
    const dimensions = vec2(input.width, input.height);
    const tileDimensions = vec2(input.tilewidth, input.tileheight);
    const tileSets: TileSet<TResource>[] = [];
    const layers = parseTiledLayers(input.layers);
    const drawOrder = parseTiledRenderOrder(input.renderorder);
    return {
        status: Map2dParserStatus.SUCCESS,
        map: new Map2d(dimensions, tileDimensions, layers, tileSets, drawOrder),
    };
}
