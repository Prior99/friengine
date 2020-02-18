import { Constructable, vec2 } from "friengine-core";
import { Shader2d, GraphicsLayer2d, SpriteManager } from "friengine-graphics-2d";
import { Texture } from "friengine-graphics/src";
import { Map2d } from "./map-2d";
import { Tile } from "./tile-stack";

export class GraphicsLayerMap2d extends GraphicsLayer2d {
    constructor(
        private map: Map2d<Texture>,
        private spriteManager: SpriteManager<Texture>,
        shaderClass?: Constructable<Shader2d, [WebGL2RenderingContext]>,
    ) {
        super(shaderClass);
    }

    private renderTile(tile: Tile<Texture>): void {
        const { tileType, position } = tile;
        if (tileType) {
            const dest = position
                .mult(this.map.tileDimensions)
                .sub(vec2(0, tileType.dimensions.y - this.map.tileDimensions.y))
                .add(tileType.offset ?? vec2(0, 0));
            this.spriteManager.get(tileType.spriteHandle).draw(this, { dest });
        }
    }

    protected render(): void {
        for (const tile of this.map.tiles()) {
            this.renderTile(tile);
        }
    }
}
