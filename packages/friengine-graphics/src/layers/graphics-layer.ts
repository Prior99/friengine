import { GraphicsOptions } from "../graphics";

export abstract class GraphicsLayer {
    protected gl: WebGL2RenderingContext | undefined;
    protected options: GraphicsOptions | undefined;

    public initialize(gl: WebGL2RenderingContext, options: GraphicsOptions): void {
        this.gl = gl;
        this.options = options;
    }

    protected abstract render(): void;
}