import { EntityManager } from "./entity-manager";
import { Constructable } from "friengine-core";
import { bind } from "bind-decorator";
import { EntityManagerForwarder } from "./entity-manager-forwarder";

export type SystemClass<T extends System = System> = Constructable<T, [EntityManager]>;

export abstract class System extends EntityManagerForwarder {
    protected time = 0;

    constructor(entityManager: EntityManager) {
        super(entityManager);
    }

    protected abstract tick(dt: number): void;

    @bind public update(dt: number): void {
        this.time += dt;
        this.tick(dt);
    }
}
