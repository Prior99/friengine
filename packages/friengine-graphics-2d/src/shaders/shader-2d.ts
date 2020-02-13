import { Shader } from "./shader";

export const shader2dUniforms = [
    "colors",
    "srcPosition",
    "srcDimensions",
    "destPosition",
    "destDimensions",
    "textureDimensions",
    "screenDimensions",
] as const;
export const shader2dAttributes = ["vertexPosition"] as const;

export type Shader2d = Shader<typeof shader2dAttributes, typeof shader2dUniforms>;