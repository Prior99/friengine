import { System, Ecs, createEcs } from "../src";

describe("System", () => {
    class TestSystem extends System {
        public time: number = 0;

        public tick = jest.fn();
    };

    let system: TestSystem;
    let ecs: Ecs;

    beforeEach(() => {
        ecs = createEcs({
            systems: [TestSystem],
        });
        system = ecs.systemManager.byClass(TestSystem)!;
    });

    describe("when ticked", () => {
        beforeEach(() => {
            ecs.systemManager.update(1000);
            ecs.systemManager.update(1500);
            ecs.systemManager.update(500);
        });
        it("sums up the time", () => expect(system.time).toBe(3000));

        it("calls tick", () => expect(system.tick).toHaveBeenCalledTimes(3));
    });
});