import { ComponentManager, ComponentClass, Ecs, createEcs } from "../src";
import { createComponent } from "./factories";

describe("ComponentManager", () => {
    let ecs: Ecs;
    let TestComponent: ComponentClass;

    beforeEach(() => {
        TestComponent = createComponent();
        ecs = createEcs();
    });

    describe("when empty", () => {
        it("doesn't find any component by name", () =>
            expect(ecs.componentManager.byName(TestComponent.name)).toBe(undefined));
    });

    describe("after adding a component", () => {
        beforeEach(() => ecs.componentManager.add(TestComponent));

        it("finds that component by name", () =>
            expect(ecs.componentManager.byName(TestComponent.name)).toBe(TestComponent));

        it("throws when adding the same component again", () => {
            expect(() => ecs.componentManager.add(TestComponent)).toThrowErrorMatchingInlineSnapshot(
                `"Can't register component twice."`,
            );
        });
    });
});
