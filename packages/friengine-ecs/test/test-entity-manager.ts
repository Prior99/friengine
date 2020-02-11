import {
    EcsParts,
    createEcs,
    ComponentClass,
    EntityManager,
    Entity,
} from "../src";
import { createComponent } from "./factories";

describe("EntityManager", () => {
    let ecs: EcsParts;
    let componentClass1: ComponentClass;
    let componentClass2: ComponentClass;
    let componentClass3: ComponentClass;
    let componentClass4: ComponentClass;
    let entityManager: EntityManager;

    beforeEach(() => {
        componentClass1 = createComponent("Component1");
        componentClass2 = createComponent("Component2");
        componentClass3 = createComponent("Component3");
        componentClass4 = createComponent("Component4");
        ecs = createEcs({ components: [componentClass1, componentClass2, componentClass3, componentClass4] });
        entityManager = ecs.entityManager;
    });

    describe("initially", () => {
        describe("when mapping entities", () => {
            let callback: (entity: Entity) => void;

            beforeEach(() => {
                callback = jest.fn();
                entityManager.map(callback);
            });

            it("doesn't call the callback", () => expect(callback).not.toHaveBeenCalled());
        });

        describe("when filtering entities", () => {
            let callback: (entity: Entity) => boolean;

            beforeEach(() => {
                callback = jest.fn(() => false);
                entityManager.filter(callback);
            });

            it("doesn't call the callback", () => expect(callback).not.toHaveBeenCalled());
        });

        describe("when iterating entities", () => {
            let callback: (entity: Entity) => void;

            beforeEach(() => {
                callback = jest.fn();
                entityManager.forEach(callback);
            });

            it("doesn't call the callback", () => expect(callback).not.toHaveBeenCalled());
        });

        it("returns empty array for withComponents", () =>
            expect(entityManager.withComponents(componentClass1)).toEqual([]));

        it("returns undefined for findOne", () => expect(entityManager.findOne(componentClass1)).toBeUndefined());

        it("throws an error when duplicating an unknown entity", () =>
            expect(() => entityManager.duplicate(89)).toThrowErrorMatchingInlineSnapshot(
                `"Attempted to clone entity of unknown id."`,
            ));
    });

    describe("after creating some entities", () => {
        let entity1: Entity;
        let entity2: Entity;
        let entity3: Entity;
        let entity4: Entity;
        let entities: Entity[];

        beforeEach(() => {
            entity1 = ecs.entityManager.createEntity({ components: [componentClass1] });
            entity2 = ecs.entityManager.createEntity({ components: [componentClass1, componentClass2] });
            entity3 = ecs.entityManager.createEntity({ components: [componentClass1, componentClass3] });
            entity4 = ecs.entityManager.createEntity({ components: [] });
            entities = [entity1, entity2, entity3, entity4];
        });

        describe("after an entity being deleted", () => {
            beforeEach(() => entity1.delete());

            it("doesn't immediately delete the entity", () =>
                expect(entityManager.withComponents(componentClass1)).toContain(entity1));

            describe("in next tick", () => {
                beforeEach(() => entityManager.update());

                it("deleted the entity", () =>
                    expect(entityManager.withComponents(componentClass1)).not.toContain(entity1));
            });
        });

        describe("after adding a component to an entity", () => {
            beforeEach(() => entity1.addComponent(componentClass4));

            it("doesn't immediately find the entity", () =>
                expect(entityManager.withComponents(componentClass4)).not.toContain(entity1));

            describe("in next tick", () => {
                beforeEach(() => entityManager.update());

                it("finds the entity", () => expect(entityManager.withComponents(componentClass4)).toContain(entity1));
            });
        });

        describe("after removing a component from an entity, adding another one and deleting it", () => {
            beforeEach(() => {
                entity1.removeComponent(componentClass1);
                entity1.addComponent(componentClass4);
                entity1.delete();
            });

            it("can still find the entity", () =>
                expect(entityManager.withComponents(componentClass1)).toContain(entity1));

            it("doesn't immediately find the entity", () =>
                expect(entityManager.withComponents(componentClass4)).not.toContain(entity1));

            describe("in next tick", () => {
                beforeEach(() => entityManager.update());

                it("cannot find the entity", () =>
                    expect(entityManager.withComponents(componentClass1)).not.toContain(entity1));
            });
        });

        describe("after removing a component from an entity", () => {
            beforeEach(() => entity1.removeComponent(componentClass1));

            it("can still find the entity", () =>
                expect(entityManager.withComponents(componentClass1)).toContain(entity1));

            describe("in next tick", () => {
                beforeEach(() => entityManager.update());

                it("cannot find the entity", () =>
                    expect(entityManager.withComponents(componentClass1)).not.toContain(entity1));
            });
        });

        describe("when iterating entities", () => {
            let callback: (entity: Entity) => void;

            beforeEach(() => {
                callback = jest.fn();
                entityManager.forEach(callback);
            });

            it.each([0, 1, 2, 3])("calls the callback with entity %#", i =>
                expect(callback).toHaveBeenCalledWith(entities[i]),
            );
        });
        describe("when mapping entities", () => {
            let callback: (entity: Entity) => number;
            let result: number[];

            beforeEach(() => {
                callback = jest.fn(entity => entity.originalCreator);
                result = entityManager.map(callback);
            });

            it.each([0, 1, 2, 3])("calls the callback with entity %#", i =>
                expect(callback).toHaveBeenCalledWith(entities[i]),
            );

            it("returns the mapped results", () =>
                expect(result).toEqual([
                    entityManager.serial,
                    entityManager.serial,
                    entityManager.serial,
                    entityManager.serial,
                ]));
        });

        describe("when filtering entities", () => {
            let callback: (entity: Entity) => boolean;
            let result: Entity[];

            beforeEach(() => {
                callback = jest.fn(entity => entity.hasComponent(componentClass1));
                result = entityManager.filter(callback);
            });

            it.each([0, 1, 2, 3])("calls the callback with entity %#", i =>
                expect(callback).toHaveBeenCalledWith(entities[i]),
            );

            it("returns the filtered result", () => expect(result).toEqual([entity1, entity2, entity3]));
        });

        it("filtering for components", () => expect(entityManager.withComponents(componentClass2)).toEqual([entity2]));

        it("finding one entity by component", () => expect(entityManager.findOne(componentClass1)).toEqual(entity1));

        describe.each([0, 1, 2, 3])("duplicating entity %#", i => {
            let duplicate: Entity;

            beforeEach(() => (duplicate = entityManager.duplicate(entities[i].id)));

            it("equals the duplicate", () => expect(entities[i].equals(duplicate)).toBe(true));

            it("is not the same as the duplicate", () => expect(entities[i].isSame(duplicate)).toBe(false));
        });
    });
});
