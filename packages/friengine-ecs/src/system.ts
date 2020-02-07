import { EntityManager } from "./entity-manager";
import { Constructable } from "friengine-core";
import { bind } from "bind-decorator";

export type SystemClass<T extends System> = Constructable<T, [EntityManager]>;

export abstract class System {
    protected milliseconds = 0;

    constructor(protected entityManager: EntityManager) {
    }

    protected abstract tick(dt: number): void;

    @bind protected filter(...args: Parameters<EntityManager["filter"]>): ReturnType<EntityManager["filter"]> {
        return this.entityManager.filter(...args);
    }

    @bind protected createEntity(...args: Parameters<EntityManager["createEntity"]>): ReturnType<EntityManager["createEntity"]> {
        return this.entityManager.createEntity(...args);
    }

    @bind protected forEach(...args: Parameters<EntityManager["forEach"]>): ReturnType<EntityManager["forEach"]> {
        return this.entityManager.forEach(...args);
    }

    @bind protected withComponents(
        ...args: Parameters<EntityManager["withComponents"]>
    ): ReturnType<EntityManager["withComponents"]> {
        return this.entityManager.withComponents(...args);
    }

    @bind protected findOne(
        ...args: Parameters<EntityManager["findOne"]>
    ): ReturnType<EntityManager["findOne"]> | undefined {
        return this.entityManager.findOne(...args);
    }

    @bind public updateFromGameLoop(milliseconds: number): void {
        this.milliseconds += milliseconds;
        this.tick(milliseconds);
    }
}
