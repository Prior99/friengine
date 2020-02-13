import {
    EcsParts,
    createEcs,
    ComponentClass,
    Entity,
    Component,
} from "../src";
import { createComponent } from "friengine-test-utils";

describe("Entity", () => {
    let ecs: EcsParts;
    let componentClass: ComponentClass;
    let entity: Entity;

    beforeEach(() => {
        componentClass = createComponent();
        ecs = createEcs({ components: [componentClass] });
        entity = ecs.entityManager.createEntity();
    });

    it("has a numeric id", () => expect(typeof entity.id).toBe("number"));

    it("stores the serial of its manager", () => expect(entity.originalCreator).toBe(ecs.entityManager.serial));

    it("is the same entity as itself", () => expect(entity.isSame(entity)).toBe(true));

    it("is equal to itself", () => expect(entity.equals(entity)).toBe(true));

    describe("initially", () => {
        it("is not dirty", () => expect(entity.dirty).toBe(false));

        it("is not marked for deletion", () => expect(entity.markedForDeletion).toBe(false));

        it("components didn't change", () => expect(entity.componentsChanged).toBe(false));

        it("cannot find any component", () => expect(entity.component(componentClass)).toBeUndefined());

        it("throws error when removing unknown component", () =>
            expect(() => entity.removeComponent(componentClass)).toThrowErrorMatchingInlineSnapshot(
                `"Can't remove component from entity that wasn't added."`,
            ));

        it("doesn't have any component", () => expect(entity.hasComponent(componentClass)).toBe(false));

        describe("when iterating components", () => {
            let callback: (componentClass: ComponentClass, component: Component) => void;

            beforeEach(() => {
                callback = jest.fn();
                entity.forEach(callback);
            });

            it("doesn't call the callback", () => expect(callback).not.toHaveBeenCalled());
        });

        it("has no component classes", () => expect(entity.componentClasses).toEqual([]));
    });

    describe("after being deleted", () => {
        beforeEach(() => entity.delete());

        it("is marked for deletion", () => expect(entity.markedForDeletion).toBe(true));

        it("is dirty", () => expect(entity.dirty).toBe(true));
    });

    describe("after adding a component", () => {
        beforeEach(() => entity.addComponent(componentClass));

        it("is dirty", () => expect(entity.dirty).toBe(true));

        it("finds that component", () => expect(entity.component(componentClass)).toEqual(expect.any(componentClass)));

        it("has that component", () => expect(entity.hasComponent(componentClass)).toBe(true));

        it("has the component class", () => expect(entity.componentClasses).toEqual([componentClass]));

        it("doesn't equal random other entity", () => expect(entity.equals(ecs.entityManager.createEntity())).toBe(false));

        it("random other entity doesn't equal this", () => expect(ecs.entityManager.createEntity().equals(entity)).toBe(false));

        describe("after being duplicated", () => {
            let duplicate: Entity;
            let spyEntityComponentEquals: jest.SpyInstance<boolean, [Component]>;
            let spyEntityComponentClone: jest.SpyInstance<Component, []>;
            let component: Component;

            beforeEach(() => {
                component = entity.component(componentClass)!;
                spyEntityComponentClone = jest.spyOn(component, "clone");
                spyEntityComponentEquals = jest.spyOn(component, "equals");
                duplicate = ecs.entityManager.duplicate(entity.id);
            });

            it("called clone on its component", () => expect(spyEntityComponentClone).toHaveBeenCalled());

            describe("when comparing for equality", () => {
                let result: boolean;

                beforeEach(() => (result = entity.equals(duplicate)));

                it("called equals on its component", () =>
                    expect(spyEntityComponentEquals).toHaveBeenCalledWith(duplicate.component(componentClass)));

                it("is equal to its duplicate", () => expect(result).toBe(true));
            });

            it("is not the same as its duplicate", () => expect(entity.isSame(duplicate)).toBe(false));

            describe("with the component reporting not to be equal", () => {
                beforeEach(() => spyEntityComponentEquals.mockImplementation(() => false));

                it("is not equal to its duplicate", () => expect(entity.equals(duplicate)).toBe(false));
            });
        });

        describe("after resetting dirty state", () => {
            beforeEach(() => entity.resetDirty());

            it("is not dirty", () => expect(entity.dirty).toBe(false));
        });

        describe("when iterating components", () => {
            let callback: (componentClass: ComponentClass, component: Component) => void;

            beforeEach(() => {
                callback = jest.fn();
                entity.forEach(callback);
            });

            it("calls the callback with the component", () =>
                expect(callback).toHaveBeenCalledWith(componentClass, expect.any(componentClass)));
        });

        describe("after removing the component", () => {
            beforeEach(() => entity.removeComponent(componentClass));

            it("cannot find that component", () => expect(entity.component(componentClass)).toBeUndefined());

            it("doesn't have that component", () => expect(entity.hasComponent(componentClass)).toBe(false));

            it("doesn't have the component class", () => expect(entity.componentClasses).toEqual([]));
        });
    });
});
