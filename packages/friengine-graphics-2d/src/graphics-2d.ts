import { defaultVertexShaderSource, defaultFragmentShaderSource, loadShader } from "./utils";
import { TextureManager } from "./texture-manager";
import { ResourceHandle, Vec2 } from "friengine-core/src";

export interface ShaderInfo {
    program: WebGLProgram;
    attributes: {
        vertexPosition: number;
    };
    uniforms: {
        colors: WebGLUniformLocation;
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
        const colors = gl.getUniformLocation(program, "colors");
        if (colors === null) {
            throw new Error(`Shader has no uniform named "colors"`);
        }
        this.shader = {
            program,
            attributes: {
                vertexPosition,
            },
            uniforms: {
                colors,
            },
        };
    }

    protected get vertexShaderSource(): string {
        return this.options.vertexShaderSource ?? defaultVertexShaderSource;
    }

    protected get fragmentShaderSource(): string {
        return this.options.fragmentShaderSource ?? defaultFragmentShaderSource;
    }

    public drawTexture(textureHandle: ResourceHandle<WebGLTexture>, _pos: Vec2): void {
        const { gl } = this;
        const { attributes } = this.shader;
        const { texture, width, height } = this.textureManager.get(textureHandle);

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
        const { program, attributes } = this.shader;

        gl.useProgram(program);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        c();
    }
}
