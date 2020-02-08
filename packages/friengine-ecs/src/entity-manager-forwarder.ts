import { bind } from "bind-decorator";
import { EntityManager } from "./entity-manager";
import { Entity } from "./entity";

type Params<T extends keyof EntityManager> = Parameters<EntityManager[T]>;
type RetVal<T extends keyof EntityManager> = ReturnType<EntityManager[T]>;
type Public<T> = {
    [K in keyof T]: T[K];
}

export class EntityManagerForwarder implements Omit<Public<EntityManager>, "update"> {
    constructor(protected entityManager: EntityManager) {
    }

    @bind public addEntity(...args: Params<"addEntity">): RetVal<"addEntity"> {
        return this.entityManager.addEntity(...args);
    }

    @bind public map<T>(callback: (entity: Entity) => T): T[] {
        return this.entityManager.map(callback);
    }

    @bind public duplicate(...args: Params<"duplicate">): RetVal<"duplicate"> {
        return this.entityManager.duplicate(...args);
    }

    @bind public filter(...args: Params<"filter">): RetVal<"filter"> {
        return this.entityManager.filter(...args);
    }

    @bind public createEntity(...args: Params<"createEntity">): RetVal<"createEntity"> {
        return this.entityManager.createEntity(...args);
    }

    @bind public forEach(...args: Params<"forEach">): RetVal<"forEach"> {
        return this.entityManager.forEach(...args);
    }

    @bind public withComponents(...args: Params<"withComponents">): RetVal<"withComponents"> {
        return this.entityManager.withComponents(...args);
    }

    @bind public findOne(...args: Params<"findOne">): RetVal<"findOne"> {
        return this.entityManager.findOne(...args);
    }
}

