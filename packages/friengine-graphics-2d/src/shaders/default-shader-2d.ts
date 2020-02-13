import { shader2dAttributes, shader2dUniforms, Shader2d } from "./shader-2d";
import { frag, vert, Shader, ShaderSources } from "friengine-graphics";

export const fragmentShader: string = frag`
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

export const vertexShader: string = vert`
    precision lowp float;

    attribute vec2 vertexPosition;

    varying vec2 textureCoords;

    void main() {
        textureCoords = vertexPosition;
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }
`;

export class DefaultShader2d extends Shader<typeof shader2dAttributes, typeof shader2dUniforms> implements Shader2d {
    constructor(gl: WebGL2RenderingContext, sources: Partial<ShaderSources> = {}) {
        super(gl, {
            attributes: shader2dAttributes,
            uniforms: shader2dUniforms,
            sources: {
                fragmentShader: sources.fragmentShader ?? fragmentShader,
                vertexShader: sources.vertexShader ?? vertexShader,
            },
        });
    }
}
