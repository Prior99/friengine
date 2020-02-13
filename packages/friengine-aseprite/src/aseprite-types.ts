export interface AsepriteOffset {
    x: number;
    y: number;
}

export function isAsepriteOffset(offset: any): offset is AsepriteOffset {
    if (typeof offset !== "object") {
        return false;
    }
    if (typeof offset.x !== "number") {
        return false;
    }
    if (typeof offset.y !== "number") {
        return false;
    }
    return true;
}

export interface AsepriteDimensions {
    w: number;
    h: number;
}

export function isAsepriteDimensions(dimensions: any): dimensions is AsepriteDimensions {
    if (typeof dimensions !== "object") {
        return false;
    }
    if (typeof dimensions.w !== "number") {
        return false;
    }
    if (typeof dimensions.h !== "number") {
        return false;
    }
    return true;
}

export interface AsepriteRect extends AsepriteOffset, AsepriteDimensions {}

export function isAspriteRect(rect: any): rect is AsepriteRect {
    return isAsepriteDimensions(rect) && isAsepriteOffset(rect);
}

export interface AsepriteFrame {
    filename: string;
    frame: AsepriteRect;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: AsepriteRect;
    sourceSize: AsepriteDimensions;
    duration: number;
}

export function isAsepriteFrame(frame: any): frame is AsepriteFrame {
    if (typeof frame !== "object") {
        return false;
    }
    if (typeof frame.filename !== "string") {
        return false;
    }
    if (!isAspriteRect(frame.frame)) {
        return false;
    }
    if (typeof frame.rotated !== "boolean") {
        return false;
    }
    if (typeof frame.trimmed !== "boolean") {
        return false;
    }
    if (!isAspriteRect(frame.spriteSourceSize)) {
        return false;
    }
    if (!isAsepriteDimensions(frame.sourceSize)) {
        return false;
    }
    if (typeof frame.duration !== "number") {
        return false;
    }
    return true;
}

export type AsepriteFrameTagDirection = "forward" | "reverse" | "pingpong";

export function isAsepriteFrameTagDirection(direction: any): direction is AsepriteFrameTagDirection {
    if (typeof direction !== "string") {
        return false;
    }
    return direction === "forward" || direction === "reverse" || direction === "pingpong";
}

export interface AsepriteFrameTag {
    name: string;
    from: number;
    to: number;
    direction: AsepriteFrameTagDirection;
}

export function isAsepriteFrameTag(frameTag: any): frameTag is AsepriteFrameTag {
    if (typeof frameTag !== "object") {
        return false;
    }
    if (typeof frameTag.name !== "string") {
        return false;
    }
    if (typeof frameTag.from !== "number") {
        return false;
    }
    if (typeof frameTag.to !== "number") {
        return false;
    }
    if (!isAsepriteFrameTagDirection(frameTag.direction)) {
        return false;
    }
    return true;
}

export interface AsepriteAtlas {
    frames: AsepriteFrame[];
    meta: {
        app: string;
        version: string;
        image: string;
        size: AsepriteDimensions;
        scale: string;
        format: string;
        frameTags?: AsepriteFrameTag[];
    };
}

export function isAsepriteAtlas(atlas: any): atlas is AsepriteAtlas {
    if (typeof atlas !== "object") {
        return false;
    }
    if (!Array.isArray(atlas.frames)) {
        return false;
    }
    if (atlas.frames.some((frame: any) => !isAsepriteFrame(frame))) {
        return false;
    }
    if (typeof atlas.meta !== "object") {
        return false;
    }
    if (typeof atlas.meta.app !== "string") {
        return false;
    }
    if (typeof atlas.meta.version !== "string") {
        return false;
    }
    if (typeof atlas.meta.image !== "string") {
        return false;
    }
    if (!isAsepriteDimensions(atlas.meta.size)) {
        return false;
    }
    if (typeof atlas.meta.scale !== "string") {
        return false;
    }
    if (typeof atlas.meta.format !== "string") {
        return false;
    }
    if (typeof atlas.meta.frameTags !== "undefined" && !Array.isArray(atlas.meta.frameTags)) {
        return false;
    }
    if (atlas.meta.some((frameTag: any) => !isAsepriteFrameTag(frameTag))) {
        return false;
    }
    return true;
}
