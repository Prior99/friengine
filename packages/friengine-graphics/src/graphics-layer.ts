import { TextureManager } from "./texture-manager";

export interface GraphicsLayerOptions {
    width: number;
    height: number;
}

export abstract class GraphicsLayer {
    protected gl!: WebGL2RenderingContext;
    protected options!: GraphicsLayerOptions;
    protected textureManager!: TextureManager;

    public initialize(gl: WebGL2RenderingContext, textureManager: TextureManager, options: GraphicsLayerOptions): void {
        this.gl = gl;
        this.options = options;
        this.textureManager = textureManager;
    }

    public get initialized(): boolean {
        return Boolean(this.gl) && Boolean(this.options) && Boolean(this.textureManager);
    }

    public redraw(): void {
        if (!this.initialized) {
            throw new Error("Tried to redraw an uninitialized layer.");
        }
        this.render();
    }

    protected abstract render(): void;
}