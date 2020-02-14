import { createGl, loadImage } from "./gl";
import { ResourceManager, JsonManager } from "friengine-core";
import { ImageManager, TextureManager, Graphics } from "friengine-graphics";
import { SpriteManager } from "friengine-graphics-2d";

// eslint-disable-next-line
export function createTestGraphics() {
    const gl = createGl();
    const resourceManager = new ResourceManager();
    const jsonManager = new JsonManager(resourceManager);
    const imageManager = new ImageManager(resourceManager, { loadImage });
    const textureManager = new TextureManager(resourceManager, imageManager, gl);
    const graphics = new Graphics(gl, textureManager, { width: 320, height: 240 });
    const spriteManager = new SpriteManager(resourceManager, jsonManager, textureManager, TextureManager.add)
    return { resourceManager, imageManager, jsonManager, textureManager, graphics, gl, spriteManager };
}
