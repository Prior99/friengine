import { Animation, AnimationDirection } from "../src";

describe("Animation", () => {
    describe.each([
        {
            from: 2,
            to: 7,
            length: 6,
            result: [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, 2, 3],
            direction: AnimationDirection.FORWARD,
        },
        {
            from: 0,
            to: 3,
            length: 4,
            result: [3, 2, 1, 0, 3, 2, 1, 0, 3, 2],
            direction: AnimationDirection.REVERSE,
        },
        {
            from: 10,
            to: 14,
            length: 5,
            result: [14, 13, 12, 11, 10, 14, 13, 12, 11, 10, 14, 13, 12, 11, 10, 14, 13, 12, 11, 10],
            direction: AnimationDirection.REVERSE,
        },
        {
            from: 1,
            to: 4,
            length: 4,
            result: [1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4],
            direction: AnimationDirection.PING_PONG,
        },
        {
            from: 0,
            to: 5,
            length: 6,
            result: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2],
            direction: AnimationDirection.PING_PONG,
        },
    ])("test %#", ({ from, to, result, direction, length }) => {
        let animation: Animation;

        beforeEach(() => (animation = new Animation("test", from, to, direction)));

        it("has correct length", () => expect(animation.length).toBe(length));

        describe("index generator", () => {
            let frameIndexGenerator: Generator<number>;
            let indices: number[];

            beforeEach(() => {
                frameIndexGenerator = animation.frameIndexGenerator();
                indices = [];
                for (let i = 0; i < result.length; ++i) {
                    indices.push(frameIndexGenerator.next().value);
                }
            });

            it("yields correct indices", () => expect(indices).toEqual(result));
        });
    });
});
