import { ResourceDrawer2d, ResourceDrawOptions2d } from "friengine-graphics-2d/src";

export class TestDrawer implements ResourceDrawer2d<string> {
    drawResource = jest.fn();
}

export function createTestDrawer() {
    return new TestDrawer();
}