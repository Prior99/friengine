import { ResourceManager } from "friengine-core";
import { ImageManager, ImageManagerOptions } from "./image-manager";
import { TextureManager } from "./texture-manager";
import { createCanvas } from "./utils";
import { Graphics, GraphicsOptions } from "./graphics";

export interface GraphicsParts {
    resourceManager: ResourceManager,
    imageManager: ImageManager;
    textureManager: TextureManager;
    canvas: HTMLCanvasElement;
    graphics: Graphics;
}

export interface CanvasOptions {
    width: number;
    height: number;
}

export interface CreateGraphicsOptions {
    resourceManager?: ResourceManager;
    canvas?: HTMLCanvasElement;
    imageManagerOptions?: ImageManagerOptions;
    canvasOptions?: CanvasOptions;
    graphicsOptions?: GraphicsOptions;
}

export function createGraphics({
    resourceManager = new ResourceManager(),
    canvas = createCanvas(0, 0),
    imageManagerOptions,
    canvasOptions,
    graphicsOptions,
}: CreateGraphicsOptions = {}): GraphicsParts {
    if (canvasOptions) {
        canvas.width = canvasOptions.width;
        canvas.height = canvasOptions.height;
    }
    const gl = canvas.getContext("webgl2");
    const { width, height } = canvasOptions ?? canvas;
    if (!gl) {
        throw new Error("Unable to initialize WebGL context.");
    }
    const imageManager = new ImageManager(resourceManager, imageManagerOptions);
    const textureManager = new TextureManager(resourceManager, imageManager, gl);
    const graphics = new Graphics(gl, textureManager, graphicsOptions ?? { width, height });
    return { resourceManager, imageManager, textureManager, canvas, graphics };
}
