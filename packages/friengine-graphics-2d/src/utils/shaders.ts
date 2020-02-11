export const frag = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];
export const vert = (source: TemplateStringsArray, ..._values: unknown[]): string => source[0];

export function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error("Unable to compile shader.");
    }
    return shader;
}

export const defaultFragmentShaderSource: string = frag`
    precision mediump float;

    uniform sampler2D colors;

    varying vec2 textureCoords;

    void main() {
        // gl_FragColor = texture2D(colors, textureCoords);
        gl_FragColor = vec4(1.0, 0, 0, 1.0);
    }
`;

export const defaultVertexShaderSource: string = vert`
    precision lowp float;

    attribute vec2 vertexPosition;

    varying vec2 textureCoords;


    void main() {
        textureCoords  = vertexPosition;
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }
`;