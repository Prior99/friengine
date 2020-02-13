import { encode, readPngFile } from "node-libpng";
import { createWebGLRenderingContext } from "node-gles";

export interface GlTestConfig {
    width?: number;
    height?: number;
    alpha?: boolean;
}

export function createGl({ width = 320, height = 240, alpha = true }: GlTestConfig = {}): WebGL2RenderingContext {
    const gl = createWebGLRenderingContext() as WebGL2RenderingContext;

    const renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, alpha ? gl.RGBA8 : gl.RGB8, width, height);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer);

    return gl;
}

export function toPng(
    gl: WebGL2RenderingContext,
    { width = 320, height = 240, alpha = true }: GlTestConfig = {},
): Buffer {
    const pixels = new Uint32Array(width * height * (alpha ? 4 : 3));
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_INT, pixels);
    const raw = Buffer.from(pixels);
    return encode(raw, { width, height });
}

export async function loadImage(path: string): Promise<HTMLImageElement> {
    const { width, height, data } = await readPngFile(path);
    return {
        data: Uint8ClampedArray.from(data),
        width,
        height,
    } as any;
}
