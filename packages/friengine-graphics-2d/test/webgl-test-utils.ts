import { createCanvas as createNodeCanvas, loadImage as loadNodeImage } from "node-canvas-webgl";

export function createCanvas(width: number, height: number): HTMLCanvasElement {
    return createNodeCanvas(width, height);
}

export function loadImage(url: string): HTMLImageElement {
    return loadNodeImage(url);
}