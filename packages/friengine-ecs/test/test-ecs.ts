import { EcsParts, createEcs, ComponentClass, SystemClass, EntityManager, ComponentManager, SystemManager } from "../src";
import { createComponent, createSystem } from "./factories";

describe("createEcs", () => {
    let ecs: EcsParts;
    let TestComponent: ComponentClass;
    let TestSystem: SystemClass;

    beforeEach(() => {
        TestComponent = createComponent();
        TestSystem = createSystem();
        ecs = createEcs({
            components: [TestComponent],
            systems: [TestSystem],
        });
    });

    it("creates an entity manager", () => expect(ecs.entityManager).toBeInstanceOf(EntityManager));

    it("creates a component manager", () => expect(ecs.componentManager).toBeInstanceOf(ComponentManager));

    it("creates a system manager", () => expect(ecs.systemManager).toBeInstanceOf(SystemManager));

    it("added the system", () => expect(ecs.systemManager.byClass(TestSystem)).toBeInstanceOf(TestSystem));

    it("added the component", () => expect(ecs.componentManager.byName(TestComponent.name)).toBe(TestComponent));
});
