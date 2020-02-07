import { Ecs, createEcs, ComponentClass, SystemClass, EntityManager, ComponentManager, SystemManager } from "../src";
import { createComponent, createSystem } from "./factories";

describe("SystemManager", () => {
    let ecs: Ecs;
    let TestSystem: SystemClass;
    let tickFn: jest.Mock;

    beforeEach(() => {
        tickFn = jest.fn();
        TestSystem = createSystem(tickFn);
        ecs = createEcs();
    });

    it("can be ticked without systems added", () => expect(() => ecs.systemManager.tick(1000)).not.toThrowError());

    describe("after adding a system", () => {
        beforeEach(() => ecs.systemManager.add(TestSystem));

        it("knows the system", () => expect(ecs.systemManager.byClass(TestSystem)).toBeInstanceOf(TestSystem));

        it("throws error when adding the same system again", () =>
            expect(() => ecs.systemManager.add(TestSystem)).toThrowErrorMatchingInlineSnapshot(
                `"Can't add system twice."`,
            ));

        describe("when ticked", () => {
            beforeEach(() => ecs.systemManager.tick(1000));

            it("ticks all systems", () => expect(tickFn).toHaveBeenCalledWith(1000));
        });
    });
});
