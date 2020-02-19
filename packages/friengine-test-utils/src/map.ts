import { Map2d, Map2dLayer, TileSet, TileType } from "friengine-maps-2d";
import { vec2, rect } from "friengine-core";
import { Texture } from "friengine-graphics";
import { SpriteManager } from "friengine-graphics-2d";
import * as path from "path";

export function createMap(): Map2d<Texture> {
    const assetsDir = path.join(__dirname, "assets");
    const wallTiles: TileType<Texture>[] = [];
    const carpetTiles: TileType<Texture>[] = [];

    for (let x = 0; x < 4; ++x) {
        wallTiles.push({
            id: x,
            spriteHandle: SpriteManager.addTile(path.join(assetsDir, "wall.png"), rect(x * 16, 0, 16, 24)),
            dimensions: vec2(16, 24),
        });
    }

    for (let y = 0; y < 3; ++y) {
        for (let x = 0; x < 3; ++x) {
            carpetTiles.push({
                id: y * 3 + x,
                spriteHandle: SpriteManager.addTile(path.join(assetsDir, "carpet.png"), rect(x * 16, y * 16, 16, 16)),
                dimensions: vec2(16, 16),
            });
        }
    }

    const tileSets = [
        new TileSet("wall", wallTiles),
        new TileSet("carpet", carpetTiles),
        new TileSet("furniture", [
            {
                id: 0,
                spriteHandle: SpriteManager.addSimple(path.join(assetsDir, "desk.png")),
                dimensions: vec2(50, 85),
            },
            {
                id: 1,
                spriteHandle: SpriteManager.addSimple(path.join(assetsDir, "couch.png")),
                dimensions: vec2(16, 32),
            },
            {
                id: 2,
                spriteHandle: SpriteManager.addSimple(path.join(assetsDir, "couch-table.png")),
                dimensions: vec2(16, 32),
            },
        ]),
    ];
    const layers = [
        new Map2dLayer(
            rect(0, 0, 7, 7),
            // eslint-ignore-next-line
            [0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 6, 6, 7, 0, 0, 8, 9, 9, 9, 10, 0, 0, 8, 9, 9, 9, 10, 0, 0, 8, 9, 9, 9, 10, 0, 0, 11, 12, 12, 12, 13, 0, 0, 0, 0, 0, 0, 0, 0],
        ),
        new Map2dLayer(
            rect(0, 0, 7, 7),
            // eslint-ignore-next-line
            [1, 4, 1, 3, 4, 4, 2, 3, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 16, 15, 4, 2, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 1, 1, 14, 0, 0, 0, 0, 4, 1, 3, 4, 1, 1, 4, 3],
            [
                { id: 1, name: "Object 1", type: "type-1", position: vec2(3, 3) },
                { id: 2, name: "Object 2", type: "type-2", position: vec2(3, 3) },
            ],
        ),
    ];
    return new Map2d(vec2(7, 7), vec2(16, 16), layers, tileSets);
}
