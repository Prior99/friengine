import { defaultVertexShaderSource, defaultFragmentShaderSource, loadShader } from "./utils";

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
}

export class Graphics2d {
    private vbo: WebGLBuffer;
    private shader!: ShaderInfo;

    constructor(public gl: WebGL2RenderingContext, protected options: Graphics2dOptions = {}) {
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

    public render(): void {
        const { gl } = this;
        const { program, attributes } = this.shader;

        gl.useProgram(program);

        gl.clearColor(255, 255, 255, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.enableVertexAttribArray(attributes.vertexPosition);
        gl.vertexAttribPointer(attributes.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
