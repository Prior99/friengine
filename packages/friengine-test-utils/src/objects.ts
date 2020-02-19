import { vec2 } from "friengine-core";
import { Map2dObject } from "friengine-maps-2d";

export function createObject(position = vec2(1, 1), name = "test-name", type = "test-type"): Map2dObject {
    return {
        position,
        name,
        type,
        visible: true,
        rotation: 0,
        id: 1,
    };
}