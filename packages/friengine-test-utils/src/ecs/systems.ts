import { System, SystemClass } from "friengine-ecs";

export function createSystem(tickFn: (ms: number) => void = jest.fn()): SystemClass {
    return class SomeSystem extends System {
        public tick = tickFn;
    }
}