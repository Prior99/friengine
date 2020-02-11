import { ResourceManager } from "friengine-core";
import { ImageManager, ImageManagerOptions } from "./image-manager";
import { TextureManager } from "./texture-manager";
import { createCanvas } from "./utils";
import { Graphics2d, Graphics2dOptions } from "./graphics-2d";

export interface Graphics2dParts {
    resourceManager: ResourceManager,
    imageManager: ImageManager;
    textureManager: TextureManager;
    canvas: HTMLCanvasElement;
    graphics2d: Graphics2d;
}

export interface CanvasOptions {
    width: number;
    height: number;
}

export interface CreateGraphics2dOptions {
    resourceManager?: ResourceManager;
    canvas?: HTMLCanvasElement;
    imageManagerOptions?: ImageManagerOptions;
    canvasOptions?: CanvasOptions;
    graphics2dOptions?: Graphics2dOptions;
}

export function createGraphics2d({
    resourceManager = new ResourceManager(),
    canvas = createCanvas(0, 0),
    imageManagerOptions,
    canvasOptions,
    graphics2dOptions,
}: CreateGraphics2dOptions = {}): Graphics2dParts {
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
    const graphics2d = new Graphics2d(gl, graphics2dOptions);
    return { resourceManager, imageManager, textureManager, canvas, graphics2d };
}
