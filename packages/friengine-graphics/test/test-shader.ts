import { Shader } from "../src";
import { logger, vec2 } from "friengine-core";
import * as utils from "../src/shaders/utils";

describe("Shader", () => {
    let gl: jest.Mocked<WebGL2RenderingContext>;
    let vertexShaderType: any;
    let fragmentShaderType: any;
    let linkStatus: any;
    let program: any;
    let attributeLocation: any;
    let uniformLocation: any;
    let vertexShader: string;
    let fragmentShader: string;

    let spyCompileShader: jest.SpyInstance<any>;
    let spyLoggerInfo: jest.SpyInstance<any>;

    beforeEach(() => {
        vertexShaderType = 18;
        fragmentShaderType = 19;
        linkStatus = 20;
        program = 100;
        attributeLocation = 111;
        uniformLocation = 112;
        vertexShader = "vertex source";
        fragmentShader = "fragment source";
        gl = {
            createProgram: jest.fn(() => program),
            attachShader: jest.fn(),
            VERTEX_SHADER: vertexShaderType,
            FRAGMENT_SHADER: fragmentShaderType,
            linkProgram: jest.fn(),
            getProgramParameter: jest.fn(() => true),
            LINK_STATUS: linkStatus,
            getAttribLocation: jest.fn(() => attributeLocation),
            getUniformLocation: jest.fn(() => uniformLocation),
            uniform1i: jest.fn(),
            uniform2f: jest.fn(),
        } as any;
        spyCompileShader = jest.spyOn(utils, "compileShader").mockImplementation(() => 17);
        spyLoggerInfo = jest.spyOn(logger, "info").mockImplementation();
    });

    describe("with the program failing to be created", () => {
        beforeEach(() => {
            gl.createProgram.mockImplementation(() => null);
        });

        it("throws", () =>
            expect(
                () => new Shader(gl, { attributes: [], uniforms: [], sources: { vertexShader, fragmentShader } }),
            ).toThrowErrorMatchingInlineSnapshot(`"Unable to create shader program."`));
    });

    describe("with the link status being bad", () => {
        beforeEach(() => {
            gl.getProgramParameter.mockImplementation(() => null);
        });

        it("throws", () =>
            expect(
                () => new Shader(gl, { attributes: [], uniforms: [], sources: { vertexShader, fragmentShader } }),
            ).toThrowErrorMatchingInlineSnapshot(`"Unable to link shader program."`));
    });

    describe("with a bad attribute", () => {
        beforeEach(() => {
            gl.getAttribLocation.mockImplementation(() => -1);
        });

        it("throws", () =>
            expect(
                () => new Shader(gl, { attributes: ["test"], uniforms: [], sources: { vertexShader, fragmentShader } }),
            ).toThrowErrorMatchingInlineSnapshot(`"Shader has no attribute named \\"test\\""`));
    });

    describe("with a bad uniform", () => {
        beforeEach(() => {
            gl.getUniformLocation.mockImplementation(() => -1);
        });

        it("throws", () =>
            expect(
                () => new Shader(gl, { attributes: [], uniforms: ["test"], sources: { vertexShader, fragmentShader } }),
            ).toThrowErrorMatchingInlineSnapshot(`"Shader has no uniform named \\"test\\""`));
    });

    describe("with the shader successfully created", () => {
        const attributes = ["testAttribute"] as const;
        const uniforms = ["testUniform"] as const;
        let shader: Shader<typeof attributes, typeof uniforms>;

        beforeEach(() => {
            shader = new Shader(gl, { attributes, uniforms, sources: { vertexShader, fragmentShader } });
        });

        it("called createProgram", () => expect(gl.createProgram).toHaveBeenCalled());

        it("called attachShader", () => expect(gl.attachShader).toHaveBeenCalledTimes(2));

        it("compiled the vertex shader", () =>
            expect(spyCompileShader).toBeCalledWith(gl, vertexShaderType, vertexShader));

        it("compiled the fragment shader", () =>
            expect(spyCompileShader).toBeCalledWith(gl, fragmentShaderType, fragmentShader));

        it("called linkProgram", () => expect(gl.linkProgram).toHaveBeenCalledWith(program));

        it("called getProgramParameter", () =>
            expect(gl.getProgramParameter).toHaveBeenCalledWith(program, linkStatus));

        it("called getAttribLocation with the attribute", () =>
            expect(gl.getAttribLocation).toHaveBeenCalledWith(program, "testAttribute"));

        it("called getUniformLocation with the uniform", () =>
            expect(gl.getUniformLocation).toHaveBeenCalledWith(program, "testUniform"));

        it("has the program", () => expect(shader.program).toBe(program));

        it("knows the attributes", () => expect(shader.attributes).toEqual({
            testAttribute: attributeLocation,
        }));

        describe("when calling uniform1i", () => {
            const value = 19;

            beforeEach(() => shader.uniform1i("testUniform", value));

            it("logged the call", () =>
                expect(spyLoggerInfo.mock.calls).toMatchInlineSnapshot(`
                    Array [
                      Array [
                        "Setting uniform \\"testUniform\\" to 19",
                      ],
                    ]
                `));

            it("called uniform1i", () => expect(gl.uniform1i).toHaveBeenCalledWith(uniformLocation, value));
        });

        describe("when calling uniform2f", () => {
            const value = vec2(10, 12);

            beforeEach(() => shader.uniform2f("testUniform", value));

            it("logged the call", () =>
                expect(spyLoggerInfo.mock.calls).toMatchInlineSnapshot(`
                    Array [
                      Array [
                        "Setting uniform \\"testUniform\\" to 19",
                      ],
                      Array [
                        "Setting uniform \\"testUniform\\" to 19",
                      ],
                      Array [
                        "Setting uniform \\"testUniform\\" to vec2(10, 12)",
                      ],
                    ]
                `));

            it("called uniform2f", () => expect(gl.uniform2f).toHaveBeenCalledWith(uniformLocation, 10, 12));
        });
    });
});
