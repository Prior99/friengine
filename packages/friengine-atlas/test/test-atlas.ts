import { Atlas, Animation, AnimationDirection, Frame } from "../src";
import { rect } from "friengine-core";

describe("Atlas", () => {
    let atlas: Atlas;
    let animations: Animation[];
    let frames: Frame[];

    beforeEach(() => {
        frames = [
            {
                rect: rect(0, 0, 8, 8),
                duration: 100,
            },
            {
                rect: rect(8, 0, 8, 8),
                duration: 200,
            },
            {
                rect: rect(16, 0, 8, 8),
                duration: 300,
            },
            {
                rect: rect(24, 0, 8, 8),
                duration: 400,
            },
        ];
    });

    describe("without animations", () => {
        beforeEach(() => {
            atlas = new Atlas("test.png", frames);
        });

        it("has a default animation", () => expect(atlas.hasAnimation("default")).toBe(true));

        it("default animation has all frames", () => expect(atlas.animation("default")!.length).toBe(4));
    });

    describe("with animations", () => {
        beforeEach(() => {
            animations = [
                new Animation("Animation 1", 0, 3, AnimationDirection.FORWARD),
                new Animation("Animation 2", 1, 3, AnimationDirection.FORWARD),
                new Animation("Animation 3", 0, 3, AnimationDirection.REVERSE),
                new Animation("Animation 4", 0, 3, AnimationDirection.PING_PONG),
            ];
            atlas = new Atlas("test.png", frames, animations);
        });

        describe.each([
            {
                name: "Animation 1",
                index: 0,
                duration: 1000,
            },
            {
                name: "Animation 2",
                index: 1,
                duration: 900,
            },
            {
                name: "Animation 3",
                index: 2,
                duration: 1000,
            },
            {
                name: "Animation 4",
                index: 3,
                duration: 1000,
            },
        ])("%j", ({ name, index, duration }) => {
            it("has animation", () => expect(atlas.hasAnimation(name)).toBe(true));

            it("can get animation", () => expect(atlas.animation(name)).toBe(animations[index]));

            it("has correct duration", () => expect(atlas.animationDuration(name)).toBe(duration));
        });

        it("doesn't have unknown animation", () => expect(atlas.hasAnimation("Unknown")).toBe(false));

        it("can't get unknown animation", () => expect(atlas.animation("Unknown")).toBeUndefined());

        it("can't get unknown animation duration", () => expect(atlas.animationDuration("Unknown")).toBeUndefined());

        it("can't get frame of unknown animation", () => expect(atlas.frame("Unknown", 0)).toBeUndefined());

        describe("access Animation 1 frames", () => {
            it.each([
                { time: 0, index: 0 },
                { time: 50, index: 0 },
                { time: 99, index: 0 },
                { time: 100, index: 1 },
                { time: 299, index: 1 },
                { time: 300, index: 2 },
                { time: 550, index: 2 },
                { time: 599, index: 2 },
                { time: 600, index: 3 },
                { time: 999, index: 3 },
                { time: 1000, index: 0 },
                { time: 1100, index: 1 },
                { time: 1999, index: 3 },
            ])("gets correct frame for %j", ({ time, index }) =>
                expect(atlas.frame("Animation 1", time)).toBe(frames[index]),
            );
        });

        describe("access Animation 2 frames", () => {
            it.each([
                { time: 0, index: 1 },
                { time: 100, index: 1 },
                { time: 199, index: 1 },
                { time: 200, index: 2 },
                { time: 499, index: 2 },
                { time: 500, index: 3 },
                { time: 899, index: 3 },
                { time: 900, index: 1 },
                { time: 1100, index: 2 },
            ])("gets correct frame for %j", ({ time, index }) =>
                expect(atlas.frame("Animation 2", time)).toBe(frames[index]),
            );
        });

        describe("access Animation 4 frames", () => {
            it.each([
                { time: 0, index: 0 },
                { time: 600, index: 3 },
                { time: 999, index: 3 },
                { time: 1000, index: 2 },
                { time: 1300, index: 1 },
                { time: 1500, index: 0 },
                { time: 1600, index: 1 },
            ])("gets correct frame for %j", ({ time, index }) =>
                expect(atlas.frame("Animation 4", time)).toBe(frames[index]),
            );
        });
    });
});
