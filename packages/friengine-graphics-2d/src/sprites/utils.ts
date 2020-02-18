import { Rect, rect, Vec2 } from "friengine-core";

export function getSourceSubRect(subRect: Rect, src: Vec2 | Rect | undefined): Rect {
    if (!src) {
        return subRect;
    }
    if (Vec2.isVec2(src)) {
        return subRect.subRect(rect(src, subRect.dimensions));
    }
    return subRect.subRect(src);
}

export function getDestinationCoordinates(src: Rect, dest: Vec2 | Rect): Rect {
    if (Vec2.isVec2(dest)) {
        return rect(dest, src.dimensions);
    }
    return dest;
}