import { compileShader } from "friengine-graphics";
import { logger } from "friengine-core";

describe("compileShader", () => {
    let gl: jest.Mocked<WebGL2RenderingContext>;
    let shader: number;
    let compileStatus: number;
    let type: number;
    let source: string;
    let log: string;

    let spyLoggerError: jest.SpyInstance<any>;
    let spyConsoleError: jest.SpyInstance<any>;

    beforeEach(() => {
        spyLoggerError = jest.spyOn(logger, "error").mockImplementation();
        spyConsoleError = jest.spyOn(console, "error").mockImplementation();

        shader = 17;
        type = 20;
        source = "some source";
        log = "something went wrong";
        gl = {
            createShader: jest.fn(),
            shaderSource: jest.fn(),
            compileShader: jest.fn(),
            COMPILE_STATUS: compileStatus,
            getShaderParameter: jest.fn(),
            getShaderInfoLog: jest.fn(() => log),
            deleteShader: jest.fn(),
        } as any;
    });

    describe("with the shader failing to be created", () => {
        beforeEach(() => gl.createShader.mockImplementation(() => null));

        it("throws", () =>
            expect(() => compileShader(gl, type, source)).toThrowErrorMatchingInlineSnapshot(
                `"Unable to create new shader."`,
            ));
    });

    describe("with the shader succeeding to be created, but compilation failing", () => {
        beforeEach(() => {
            gl.createShader.mockImplementation(() => shader);
            gl.getShaderParameter.mockImplementation(() => false);
            try {
                compileShader(gl, type, source);
            } catch {}
        });

        it("calls createShader", () => expect(gl.createShader).toHaveBeenCalledWith(type));

        it("calls shaderSource", () => expect(gl.shaderSource).toHaveBeenCalledWith(shader, source));

        it("calls compileShader", () => expect(gl.compileShader).toHaveBeenCalledWith(shader));

        it("calls getShaderParameter", () => expect(gl.getShaderParameter).toHaveBeenCalledWith(shader, compileStatus));

        it("calls getShaderInfoLog", () => expect(gl.getShaderInfoLog).toHaveBeenCalledWith(shader));

        it("calls deleteShader", () => expect(gl.deleteShader).toHaveBeenCalledWith(shader));

        it("calls error on logger", () => expect(spyLoggerError).toHaveBeenCalledWith(log));

        it("calls error on console", () => expect(spyConsoleError).toHaveBeenCalledWith(log));

        it("throws", () =>
            expect(() => compileShader(gl, type, source)).toThrowErrorMatchingInlineSnapshot(
                `"Unable to compile shader."`,
            ));
    });

    describe("with everything succeeding", () => {
        let result: any;
        beforeEach(() => {
            gl.createShader.mockImplementation(() => shader);
            gl.getShaderParameter.mockImplementation(() => true);
            result = compileShader(gl, type, source);
        });

        it("returns shader", () => expect(result).toBe(shader));
    });
});
