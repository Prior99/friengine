import { compileShader } from "./utils";
import { logger, Vec2 } from "friengine-core";

export type ShaderAttributes<TAttributes extends readonly string[]> = {
    [TKey in TAttributes[number]]: number;
};

export type ShaderUniforms<TUniforms extends readonly string[]> = {
    [TKey in TUniforms[number]]: WebGLUniformLocation;
};

export type ShaderInfo<TAttributes extends readonly string[], TUniforms extends readonly string[]> = {
    program: WebGLProgram;
    attributes: ShaderAttributes<TAttributes>;
    uniforms: ShaderUniforms<TUniforms>;
};

export interface ShaderSources {
    fragmentShader: string;
    vertexShader: string;
}

export interface ShaderOptions<TAttributes extends readonly string[], TUniforms extends readonly string[]> {
    attributes: TAttributes;
    uniforms: TUniforms;
    sources: ShaderSources;
}

export class Shader<TAttributes extends readonly string[], TUniforms extends readonly string[]> {
    protected info: ShaderInfo<TAttributes, TUniforms>;

    constructor(private gl: WebGL2RenderingContext, public options: ShaderOptions<TAttributes, TUniforms>) {
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create shader program.");
        }
        gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, options.sources.vertexShader));
        gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, options.sources.fragmentShader));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error("Unable to link shader program.");
        }
        const attributes = options.attributes.reduce((result, current) => {
            const location = gl.getAttribLocation(program, current);
            if (location === null || location === -1) {
                throw new Error(`Shader has no attribute named "${current}"`);
            }
            return { ...result, [current]: location };
        }, {} as ShaderAttributes<TAttributes>);
        const uniforms = options.uniforms.reduce((result, current) => {
            const location = gl.getUniformLocation(program, current);
            if (location === null || location === -1) {
                throw new Error(`Shader has no uniform named "${current}"`);
            }
            return { ...result, [current]: location };
        }, {} as ShaderUniforms<TUniforms>);
        this.info = {
            program,
            attributes,
            uniforms,
        };
    }

    public get program(): WebGLProgram {
        return this.info.program;
    }

    public get attributes(): ShaderAttributes<TAttributes> {
        return this.info.attributes;
    }

    public uniform1i(uniform: keyof ShaderUniforms<TUniforms>, value: number): void {
        logger.info(`Setting uniform "${uniform}" to ${value}`);
        this.gl.uniform1i(this.info.uniforms[uniform], value);
    }

    public uniform2f(uniform: keyof ShaderUniforms<TUniforms>, vec: Vec2): void {
        logger.info(`Setting uniform "${uniform}" to vec2(${vec.x}, ${vec.y})`);
        this.gl.uniform2f(this.info.uniforms[uniform], vec.x, vec.y);
    }
}
