import { Constructable, vec2 } from "friengine-core";
import { GraphicsLayer, GraphicsLayerOptions, TextureManager, Texture } from "friengine-graphics";
import { Shader2d, DefaultShader2d } from "../shaders";
import { ResourceDrawOptions2d, ResourceDrawer2d } from "../resource-drawer-2d";

export abstract class GraphicsLayer2d extends GraphicsLayer implements ResourceDrawer2d<Texture> {
    protected shader!: Shader2d;
    private vbo!: WebGLBuffer;

    constructor(private shaderClass: Constructable<Shader2d, [WebGL2RenderingContext]> = DefaultShader2d) {
        super();
    }

    public initialize(gl: WebGL2RenderingContext, textureManager: TextureManager, options: GraphicsLayerOptions): void {
        super.initialize(gl, textureManager, options);
        this.shader = new this.shaderClass(gl);
        this.vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        gl.useProgram(this.shader.program);
        this.shader.uniform2f("screenDimensions", vec2(options.width, options.height));
    }

    public get initialized(): boolean {
        return super.initialized && Boolean(this.vbo) && Boolean(this.shader);
    }

    public drawResource({
        handle,
        srcPosition,
        destPosition,
        srcDimensions,
        destDimensions,
    }: ResourceDrawOptions2d<Texture>): void {
        const { gl } = this;
        const { attributes } = this.shader;
        const { texture, width, height } = this.textureManager.get(handle);

        gl.useProgram(this.shader.program);

        const textureDimensions = vec2(width, height);
        this.shader.uniform2f("destDimensions", destDimensions ?? textureDimensions);
        this.shader.uniform2f("srcDimensions", srcDimensions ?? textureDimensions);
        this.shader.uniform2f("srcPosition", srcPosition ?? vec2(0, 0));
        this.shader.uniform2f("destPosition", destPosition);
        this.shader.uniform2f("textureDimensions", textureDimensions);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.shader.uniform1i("colors", 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.enableVertexAttribArray(attributes.vertexPosition);
        gl.vertexAttribPointer(attributes.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    protected abstract render(): void;
}