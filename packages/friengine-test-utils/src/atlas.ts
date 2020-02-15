import { Atlas } from "friengine-atlas";
import { rect } from "friengine-core";

export function createAtlas() {
    return new Atlas("image.png", [
        { rect: rect(0, 0, 8, 8), duration: 100 },
        { rect: rect(8, 0, 8, 8), duration: 200 },
        { rect: rect(16, 0, 8, 8), duration: 300 },
        { rect: rect(24, 0, 8, 8), duration: 400 },
    ]);
}
