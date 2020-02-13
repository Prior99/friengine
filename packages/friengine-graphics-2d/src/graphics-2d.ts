import { defaultVertexShaderSource, defaultFragmentShaderSource, compileShader } from "./utils";
import { TextureManager } from "./texture-manager";
import { ResourceHandle, Vec2, vec2, logger } from "friengine-core";
import { Shader } from "./shader";

export interface DrawTextureOptions {
    textureHandle: ResourceHandle<WebGLTexture>;
    srcPosition?: Vec2;
    destPosition: Vec2;
    srcDimensions?: Vec2;
    destDimensions?: Vec2;
}

export interface Graphics2dOptions {
    vertexShaderSource?: string;
    fragmentShaderSource?: string;
    width: number;
    height: number;
}

const uniforms = [
    "colors",
    "srcPosition",
    "srcDimensions",
    "destPosition",
    "destDimensions",
    "textureDimensions",
    "screenDimensions",
] as const;
const attributes = ["vertexPosition"] as const;

export class Graphics2d {
    private vbo: WebGLBuffer;
    private shader!: Shader<typeof attributes, typeof uniforms>;

    constructor(
        public gl: WebGL2RenderingContext,
        protected textureManager: TextureManager,
        protected options: Graphics2dOptions,
    ) {
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, options.width, options.height);
        this.vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        this.shader = new Shader(gl, {
            uniforms,
            attributes,
            sources: {
                fragmentShader: options.fragmentShaderSource ?? defaultFragmentShaderSource,
                vertexShader: options.vertexShaderSource ?? defaultVertexShaderSource,
            },
        });
        gl.useProgram(this.shader.program);
        this.shader.uniform2f("screenDimensions", vec2(options.width, options.height));
    }

    protected get vertexShaderSource(): string {
        return this.options.vertexShaderSource ?? defaultVertexShaderSource;
    }

    protected get fragmentShaderSource(): string {
        return this.options.fragmentShaderSource ?? defaultFragmentShaderSource;
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
