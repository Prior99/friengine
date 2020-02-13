import { TextureManager } from "./texture-manager";
import { ResourceHandle, Vec2, vec2 } from "friengine-core";
import { DefaultShader2d } from "./shaders";
import { Shader2d } from "./shaders";

export interface DrawTextureOptions {
    textureHandle: ResourceHandle<WebGLTexture>;
    srcPosition?: Vec2;
    destPosition: Vec2;
    srcDimensions?: Vec2;
    destDimensions?: Vec2;
}

export interface GraphicsOptions {
    width: number;
    height: number;
}


export class Graphics {
    private vbo: WebGLBuffer;
    private shader!: Shader2d;

    constructor(
        public gl: WebGL2RenderingContext,
        protected textureManager: TextureManager,
        protected options: GraphicsOptions,
    ) {
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, options.width, options.height);
        this.vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        this.shader = new DefaultShader2d(gl);
        gl.useProgram(this.shader.program);
        this.shader.uniform2f("screenDimensions", vec2(options.width, options.height));
    }

    public drawTexture({
        textureHandle,
        srcPosition,
        destPosition,
        srcDimensions,
        destDimensions,
    }: DrawTextureOptions): void {
        const { gl } = this;
        const { attributes } = this.shader;
        const { texture, width, height } = this.textureManager.get(textureHandle);

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

    public render(c: () => void): void {
        const { gl } = this;

        gl.useProgram(this.shader.program);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        c();
    }
}
