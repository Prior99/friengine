import { TextureManager } from "./texture-manager";
import { GraphicsLayer } from "./graphics-layer";

export interface GraphicsOptions {
    width: number;
    height: number;
}


export class Graphics {
    private layers: GraphicsLayer[] = [];

    constructor(
        public gl: WebGL2RenderingContext,
        protected textureManager: TextureManager,
        protected options: GraphicsOptions,
    ) {
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, options.width, options.height);
    }

    public addLayer(layer: GraphicsLayer): void {
        if (!layer.initialized) {
            layer.initialize(this.gl, this.textureManager, this.options);
        }
        this.layers.push(layer);
    }

    public render(): void {
        const { gl } = this;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.layers.forEach(layer => layer.redraw());
    }
}
