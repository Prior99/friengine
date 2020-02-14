import { AtlasParserResult, AtlasParserStatus, AnimationDirection, Animation, Atlas } from "friengine-atlas";
import { isAsepriteAtlas, AsepriteFrameTagDirection } from "./aseprite-types";
import { rect } from "friengine-core";

export function parseAsepriteAnimationDirection(direction: AsepriteFrameTagDirection): AnimationDirection {
    switch (direction) {
        case "forward": return AnimationDirection.FORWARD;
        case "reverse": return AnimationDirection.REVERSE;
        case "pingpong": return AnimationDirection.PING_PONG;
    }
}

export function parseAsepriteAtlas(input: unknown): AtlasParserResult {
    if (!isAsepriteAtlas(input)) {
        return { status: AtlasParserStatus.ERROR };
    }
    const frames = input.frames.map(({ frame, duration }) => ({
        duration,
        rect: rect(frame.x, frame.y, frame.w, frame.h),
    }));
    const animations = input.meta.frameTags?.map(({ name, from, to, direction }) => new Animation(
        name,
        from,
        to,
        parseAsepriteAnimationDirection(direction),
    ));
    return {
        status: AtlasParserStatus.SUCCESS,
        atlas: new Atlas(input.meta.image, frames, animations),
    };
}
