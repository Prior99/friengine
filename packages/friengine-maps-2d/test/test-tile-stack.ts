import { TileStack } from "friengine-maps-2d";
import { createMap } from "friengine-test-utils";
import { vec2 } from "friengine-core";
import { Texture } from "friengine-graphics";

describe("TileStack", () => {
    let tileStack: TileStack<Texture>;

    beforeEach(() => {
        let map = createMap();
        map.layers[0].objects.push({ id: 3, name: "Object 3", type: "type-3", position: vec2(3, 3) });
        map.layers[1].objects.push({ id: 4, name: "Object 4", type: "type-4", position: vec2(4, 4) });
        tileStack = map.at(vec2(4, 4));
    });

    it("has correct list of objects", () =>
        expect(tileStack.allObjects).toEqual([
            { id: 1, name: "Object 1", type: "type-1", position: vec2(4, 4) },
            { id: 3, name: "Object 3", type: "type-3", position: vec2(4, 4) },
            { id: 4, name: "Object 4", type: "type-4", position: vec2(4, 4) },
        ]));
});
