declare module "node-canvas-webgl" {
    export function createCanvas(width: number, height: number): HTMLCanvasElement;

    export function loadImage(url: string): HTMLImageElement;
}