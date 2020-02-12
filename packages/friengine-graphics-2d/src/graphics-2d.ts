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
    private screenTexture: WebGLTexture;
    private writeFrameBuffer: WebGLFramebuffer;
    private readFrameBuffer: WebGLFramebuffer;

    constructor(
        public gl: WebGL2RenderingContext,
        protected textureManager: TextureManager,
        protected options: Graphics2dOptions,
    ) {
        gl.viewport(0, 0, options.width, options.height);
        // gl.enable(gl.TEXTURE_2D);
        this.vbo = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
        this.screenTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);

        //     source: ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): void; // May throw DOMException
        // texImage2D(target: number, level: number, internalformat: number, width: number, height: number,
        //     border: number, format: number, type: number, srcData: ArrayBufferView,
        //     srcOffset: number): void;
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            options.width,
            options.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array(options.width * options.height * 4),
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.shader = {
            program,
            attributes: {
                vertexPosition,
            },
            uniforms: {
                colors,
            },
        };
        this.writeFrameBuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.writeFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);

        this.readFrameBuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.writeFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
    }

    protected get vertexShaderSource(): string {
        return this.options.vertexShaderSource ?? defaultVertexShaderSource;
    }

    protected get fragmentShaderSource(): string {
        return this.options.fragmentShaderSource ?? defaultFragmentShaderSource;
    }

    public drawTexture(textureHandle: ResourceHandle<WebGLTexture>, _pos: Vec2): void {
        const { gl } = this;
        const texture = this.textureManager.get(textureHandle);
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.writeFrameBuffer);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, this.readFrameBuffer);

        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screenTexture, 0);
        // gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        // gl.blitFramebuffer(0, 0, 64, 64, 0, 0, 64, 64, gl.COLOR_BUFFER_BIT, gl.NEAREST);

        // gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    }

    public render(c: () => void): void {
        const { gl } = this;
        const { program, attributes } = this.shader;

        gl.useProgram(program);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        c();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.screenTexture);
        gl.uniform1i(this.shader.uniforms.colors, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.enableVertexAttribArray(attributes.vertexPosition);
        gl.vertexAttribPointer(attributes.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
