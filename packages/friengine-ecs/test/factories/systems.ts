import { System } from "../../src";

export function createSystem(tickFn: (ms: number) => void = jest.fn()) {
    return class SomeSystem extends System {
        public tick = tickFn;
    }
}