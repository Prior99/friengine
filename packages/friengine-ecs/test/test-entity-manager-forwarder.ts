import { System, SystemClass, Ecs, createEcs, EntityManager, Entity, CreateEntityOptions, ComponentClass } from "../src";
import { createComponent } from "./factories";
import { EntityManagerForwarder } from "../src/entity-manager-forwarder";

describe("EntityManagerForwarder", () => {
    let forwarder: EntityManagerForwarder;
    let ecs: Ecs;

    beforeEach(() => {
        ecs = createEcs({
            components: [createComponent()],
        });
        forwarder = new EntityManagerForwarder(ecs.entityManager);
        jest.spyOn(ecs.entityManager, "addEntity");
        jest.spyOn(ecs.entityManager, "map");
        jest.spyOn(ecs.entityManager, "duplicate");
        jest.spyOn(ecs.entityManager, "filter");
        jest.spyOn(ecs.entityManager, "createEntity");
        jest.spyOn(ecs.entityManager, "forEach");
        jest.spyOn(ecs.entityManager, "withComponents");
        jest.spyOn(ecs.entityManager, "findOne");
    });

    describe("when calling addEntity", () => {
        let entity: Entity;

        beforeEach(() => {
            entity = new Entity(1, 1);
            forwarder.addEntity(entity);
        });

        it("forwards the call", () => expect(ecs.entityManager.addEntity).toHaveBeenCalledWith(entity));
    });

    describe("when calling map", () => {
        let callback: () => void;

        beforeEach(() => {
            callback = jest.fn();
            forwarder.map(callback);
        });

        it("forwards the call", () => expect(ecs.entityManager.map).toHaveBeenCalledWith(callback));
    });

    describe("when calling duplicate", () => {
        let id: number;

        beforeEach(() => {
            id = forwarder.createEntity().id;
            forwarder.duplicate(id);
        });

        it("forwards the call", () => expect(ecs.entityManager.duplicate).toHaveBeenCalledWith(id));
    });

    describe("when calling filter", () => {
        let callback: () => boolean;

        beforeEach(() => {
            callback = jest.fn();
            forwarder.filter(callback);
        });

        it("forwards the call", () => expect(ecs.entityManager.filter).toHaveBeenCalledWith(callback));
    });

    describe("when calling createEntity", () => {
        let options: CreateEntityOptions;

        beforeEach(() => {
            options = {};
            forwarder.createEntity(options);
        });

        it("forwards the call", () => expect(ecs.entityManager.createEntity).toHaveBeenCalledWith(options));

        it("returns the result", () => expect(ecs.entityManager.createEntity).toHaveLastReturnedWith(expect.any(Entity)));
    });

    describe("when calling forEach", () => {
        let callback: () => void;

        beforeEach(() => {
            callback = jest.fn();
            forwarder.forEach(callback);
        });

        it("forwards the call", () => expect(ecs.entityManager.forEach).toHaveBeenCalledWith(callback));
    });

    describe("when calling withComponents", () => {
        let componentClass: ComponentClass;

        beforeEach(() => {
            componentClass = createComponent();
            forwarder.withComponents(componentClass);
        });

        it("forwards the call", () => expect(ecs.entityManager.withComponents).toHaveBeenCalledWith(componentClass));
    });

    describe("when calling findOne", () => {
        let componentClass: ComponentClass;

        beforeEach(() => {
            componentClass = createComponent();
            forwarder.findOne(componentClass);
        });

        it("forwards the call", () => expect(ecs.entityManager.findOne).toHaveBeenCalledWith(componentClass));
    });
});