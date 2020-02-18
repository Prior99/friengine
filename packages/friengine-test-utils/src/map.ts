import { Map2d, Map2dLayer, TileSet } from "friengine-maps-2d";
import { vec2, rect } from "friengine-core";
import { Texture } from "friengine-graphics";
import { SpriteManager } from "friengine-graphics-2d";
import * as path from "path";

export function createMap(
    tileSet1Filename = path.join(__dirname, "assets", "tileset1.png"),
    tileSet2Filename = path.join(__dirname, "assets", "tileset2.png"),
): Map2d<Texture> {
    const tileSets = [
        new TileSet("floors", vec2(16, 16), [
            { id: 1, spriteHandle: SpriteManager.addTile(tileSet1Filename, rect(0, 0, 16, 16)) },
            { id: 2, spriteHandle: SpriteManager.addTile(tileSet1Filename, rect(16, 0, 16, 16)) },
            { id: 3, spriteHandle: SpriteManager.addTile(tileSet1Filename, rect(0, 16, 16, 16)) },
            { id: 4, spriteHandle: SpriteManager.addTile(tileSet1Filename, rect(16, 16, 16, 16)) },
        ]),
        new TileSet("walls", vec2(16, 16), [
            { id: 1, spriteHandle: SpriteManager.addTile(tileSet2Filename, rect(0, 0, 16, 16)) },
            { id: 2, spriteHandle: SpriteManager.addTile(tileSet2Filename, rect(16, 0, 16, 16)) },
        ]),
    ];
    const layers = [
        new Map2dLayer(
            rect(0, 0, 7, 5),
            [],
            [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 3, 4, 3, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        ),
        new Map2dLayer(
            rect(0, 0, 7, 5),
            [
                { id: 1, name: "Object 1", type: "type-1", position: vec2(3, 3) },
                { id: 2, name: "Object 2", type: "type-2", position: vec2(3, 3) },
            ],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
        ),
    ];
    return new Map2d(vec2(7, 5), layers, tileSets);
}
