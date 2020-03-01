import { TileSet, TileType } from "friengine-maps-2d";
import { SpriteManager } from "friengine-graphics-2d";
import { vec2 } from "friengine-core";
import { Texture } from "friengine-graphics";

describe("TileSet", () => {
    let tileSet: TileSet<Texture>;
    let tileType: TileType<Texture>;

    beforeEach(() => {
        tileType = {
            id: 17,
            spriteHandle: SpriteManager.addSimple("resource-1.png"),
            dimensions: vec2(50, 85),
        };
        tileSet = new TileSet("furniture", [
            {
                id: 0,
                spriteHandle: SpriteManager.addSimple("resource-1.png"),
                dimensions: vec2(50, 85),
            },
            tileType,
        ]);
    });

    it("has correct tile count", () => expect(tileSet.count).toBe(2));

    it("has correct upper id limit", () => expect(tileSet.upperLimit).toBe(17));

    it("can get tile type by id", () => expect(tileSet.byId(17)).toBe(tileType));
});
