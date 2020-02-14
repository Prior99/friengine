import { AnimationDirection } from "./atlas-types";

export class Animation {
    constructor(public name: string, public from: number, public to: number, public direction: AnimationDirection) {}

    public get length(): number {
        return this.to - this.from + 1;
    }

    public *frameIndexGenerator(): Generator<number> {
        const { length } = this;
        switch (this.direction) {
            case AnimationDirection.FORWARD: {
                for (let index = 0; ; index = (index + 1) % length) {
                    yield index + this.from;
                }
            }
            case AnimationDirection.REVERSE: {
                for (let index = 0; ; index = (index + 1) % length) {
                    yield length - index + this.from - 1;
                }
            }
            case AnimationDirection.PING_PONG: {
                for (let index = this.length - 1; ; index++) {
                    yield Math.abs(index % (length * 2 - 2) - (length - 1)) + this.from;
                }
            }
        }
    }
}
