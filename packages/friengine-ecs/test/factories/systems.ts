import { System, SystemClass } from "../../src";

export function createSystem(tickFn: (ms: number) => void = jest.fn()): SystemClass {
    return class SomeSystem extends System {
        public tick = tickFn;
    }
}