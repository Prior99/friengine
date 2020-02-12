import { defaultVertexShaderSource, defaultFragmentShaderSource, loadShader } from "./utils";
import { TextureManager } from "./texture-manager";
import { ResourceHandle, Vec2, vec2, logger } from "friengine-core";

export interface DrawTextureOptions {
    textureHandle: ResourceHandle<WebGLTexture>;
    srcPosition?: Vec2;
    destPosition: Vec2;
    srcDimensions?: Vec2;
    destDimensions?: Vec2;
}

export interface ShaderInfo {
    program: WebGLProgram;
    attributes: {
        vertexPosition: number;
    };
    uniforms: {
        colors: WebGLUniformLocation;
        screenDimensions: WebGLUniformLocation;
        srcDimensions: WebGLUniformLocation;
        srcPosition: WebGLUniformLocation;
        destDimensions: WebGLUniformLocation;
        destPosition: WebGLUniformLocation;
        textureDimensions: WebGLUniformLocation;
    };
}

export interface Graphics2dOptions {
    vertexShaderSource?: string;
    fragmentShaderSource?: string;
    width: number;
    height: number;
}

export class Graphics2d {
    private vbo: WebGLBuffer;
    private shader!: ShaderInfo;

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
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error("Unable to link shader program.");
        }
        const vertexPosition = gl.getAttribLocation(program, "vertexPosition");
        if (vertexPosition === -1) {
            throw new Error(`Shader has no attribute named "vertexPosition"`);
        }
        this.shader = {
            program,
            attributes: {
                vertexPosition,
            },
            uniforms: {
                colors: this.getUniformLocation(program, "colors"),
                srcPosition: this.getUniformLocation(program, "srcPosition"),
                srcDimensions: this.getUniformLocation(program, "srcDimensions"),
                destPosition: this.getUniformLocation(program, "destPosition"),
                destDimensions: this.getUniformLocation(program, "destDimensions"),
                textureDimensions: this.getUniformLocation(program, "textureDimensions"),
                screenDimensions: this.getUniformLocation(program, "screenDimensions"),
            },
        };
        gl.useProgram(program);
        this.uniform2f("screenDimensions", vec2(options.width, options.height));
    }

    private getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation {
        const location = this.gl.getUniformLocation(program, name);
        if (location === null || location === -1) {
            throw new Error(`Shader has no uniform named "${name}"`);
        }
        return location;
    }

    private uniform2f(uniform: keyof ShaderInfo["uniforms"], vec: Vec2): void {
        logger.info(`Setting uniform "${uniform}" to vec2(${vec.x}, ${vec.y})`);
        this.gl.uniform2f(this.shader.uniforms[uniform], vec.x, vec.y);
    }

    protected get vertexShaderSource(): string {
        return this.options.vertexShaderSource ?? defaultVertexShaderSource;
    }

    protected get fragmentShaderSource(): string {
        return this.options.fragmentShaderSource ?? defaultFragmentShaderSource;
    }

    public drawTexture({ textureHandle, srcPosition, destPosition, srcDimensions, destDimensions }: DrawTextureOptions): void {
        const { gl } = this;
        const { attributes } = this.shader;
        const { texture, width, height } = this.textureManager.get(textureHandle);

        const textureDimensions = vec2(width, height);
        this.uniform2f("destDimensions", destDimensions ?? textureDimensions);
        this.uniform2f("srcDimensions", srcDimensions ?? textureDimensions);
        this.uniform2f("srcPosition", srcPosition ?? vec2(0, 0));
        this.uniform2f("destPosition", destPosition);
        this.uniform2f("textureDimensions", textureDimensions);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.shader.uniforms.colors, 0);

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
