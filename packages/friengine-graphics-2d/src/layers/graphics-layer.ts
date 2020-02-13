import { Graphics2dOptions } from "../graphics-2d";

export abstract class GraphicsLayer {
    protected gl: WebGL2RenderingContext | undefined;
    protected options: Graphics2dOptions | undefined;

    public initialize(gl: WebGL2RenderingContext, options: Graphics2dOptions): void {
        this.gl = gl;
        this.options = options;
    }

    protected abstract render(): void;
}