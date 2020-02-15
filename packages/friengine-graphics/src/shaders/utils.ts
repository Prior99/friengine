import { logger } from "friengine-core";

export const frag = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];
export const vert = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Unable to create new shader.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        console.error(log);
        logger.error(log!);
        gl.deleteShader(shader);
        throw new Error("Unable to compile shader.");
    }
    return shader;
}
