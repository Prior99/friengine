import { System } from "../../src";

export function createSystem() {
    return class SomeSystem extends System {
        public tick = jest.fn();
    }
}