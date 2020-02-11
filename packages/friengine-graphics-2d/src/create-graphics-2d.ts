import { ResourceManager } from "friengine-core";
import { ImageManager, ImageManagerOptions } from "./image-manager";
import { TextureManager } from "./texture-manager";
import { createCanvas } from "./utils";

export interface Graphics2dParts {
    resourceManager: ResourceManager,
    imageManager: ImageManager;
    textureManager: TextureManager;
    canvas: HTMLCanvasElement;
}

export interface CanvasOptions {
    width: number;
    height: number;
}

export interface Graphics2dOptions {
    resourceManager?: ResourceManager;
    canvas?: HTMLCanvasElement;
    imageManagerOptions?: ImageManagerOptions;
    canvasOptions?: CanvasOptions;
}

export function createGraphics2d({
    resourceManager = new ResourceManager(),
    canvas = createCanvas(0, 0),
    imageManagerOptions,
    canvasOptions,
}: Graphics2dOptions = {}): Graphics2dParts {
    if (canvasOptions) {
        canvas.width = canvasOptions.width;
        canvas.height = canvasOptions.height;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("Unable to initialize WebGL context.");
    }
    const imageManager = new ImageManager(resourceManager, imageManagerOptions);
    const textureManager = new TextureManager(resourceManager, imageManager, gl);
    return { resourceManager, imageManager, textureManager, canvas };
}
