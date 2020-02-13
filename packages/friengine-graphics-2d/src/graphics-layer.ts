export abstract class GraphicsLayer {
    protected gl: WebGL2RenderingContext | undefined;

    public initialize(gl: WebGL2RenderingContext): void {
        this.gl = gl;
    }

    protected abstract render(): void;
}