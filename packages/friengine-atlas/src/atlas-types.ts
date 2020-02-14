import { Rect } from "friengine-core";

export interface Frame {
    duration: number;
    rect: Rect;
}

export enum AnimationDirection {
    FORWARD = "forward",
    REVERSE = "reverse",
    PING_PONG = "ping pong",
}

export interface Animation {
    name: string;
    from: number;
    to: number;
    direction: AnimationDirection;
}