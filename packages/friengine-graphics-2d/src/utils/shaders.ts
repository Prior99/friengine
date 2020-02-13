import { logger } from "friengine-core";

export const frag = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];
export const vert = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;
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

export const defaultFragmentShaderSource: string = frag`
    precision mediump float;

    uniform sampler2D colors;

    uniform vec2 srcPosition;
    uniform vec2 srcDimensions;

    uniform vec2 destPosition;
    uniform vec2 destDimensions;

    uniform vec2 textureDimensions;
    uniform vec2 screenDimensions;

    varying vec2 textureCoords;

    const vec2 adjustScreenSpace = vec2(0.5, 0.5);

    void main() {
        vec2 currentPosition = textureCoords * adjustScreenSpace + adjustScreenSpace;
        vec2 destPositionRelative = destPosition / screenDimensions;
        vec2 destDimensionsRelative = destDimensions / screenDimensions;

        if (
            any(lessThan(currentPosition, destPositionRelative)) ||
            any(greaterThan(currentPosition, destPositionRelative + destDimensionsRelative))
        ) {
            gl_FragColor = vec4(0, 0, 0, 0);
        } else {
            vec2 srcPositionRelative = srcPosition / textureDimensions;
            vec2 srcDimensionsRelative = srcDimensions / textureDimensions;
            vec2 normalizedSrcPosition = (currentPosition - destPositionRelative) / destDimensionsRelative;
            vec2 positionInTexture = normalizedSrcPosition * srcDimensionsRelative + srcPositionRelative;
            gl_FragColor = texture2D(colors, positionInTexture);
        }
    }
`;

export const defaultVertexShaderSource: string = vert`
    precision lowp float;

    attribute vec2 vertexPosition;

    varying vec2 textureCoords;

    void main() {
        textureCoords = vertexPosition;
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }
`;
