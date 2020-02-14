import { Frame, AnimationDirection } from "./atlas-types";
import { Animation } from "./animation";

export class Atlas {
    private animations = new Map<string, Animation>();

    constructor(public frames: Frame[], animations?: Animation[]) {
        if (animations) {
            animations.forEach(animation => this.animations.set(animation.name, animation));
        } else {
            this.animations.set("default", new Animation("default", 0, frames.length, AnimationDirection.FORWARD));
        }
    }

    public hasAnimation(name: string): boolean {
        return this.animations.has(name);
    }

    public animation(name: string): Animation | undefined {
        return this.animations.get(name);
    }

    public animationDuration(animationName: string): number | undefined {
        const animation = this.animations.get(animationName);
        if (!animation) {
            return;
        }
        let duration = 0;
        for (let index = animation.from; index <= animation.to; index++) {
            duration += this.frames[index].duration;
        }
        return duration;
    }

    public getFrame(animationName: string, time: number): Frame | undefined {
        const animation = this.animations.get(animationName);
        if (!animation) {
            return;
        }
        const frameGenerator = this.frameGenerator(animationName)!;
        let frame: Frame;
        do {
            frame = frameGenerator.next().value;
            time -= frame.duration;
        } while (time > 0);
        return frame;
    }

    public *frameGenerator(animationName: string): Generator<Frame> | undefined {
        const animation = this.animations.get(animationName);
        if (!animation) {
            return;
        }
        const indexGenerator = animation.frameIndexGenerator();
        const { frames } = this;
        while (true) {
            yield frames[indexGenerator.next().value];
        }
    }
}
