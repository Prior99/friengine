import { Constructable } from "friengine-core";
import { System, SystemClass } from "./system";
import { bind } from "bind-decorator";
import { EntityManager } from "./entity-manager";

export class SystemManager {
    constructor(private entityManager: EntityManager) {}

    private systems = new Map<SystemClass<System>, System>();

    @bind public getSystem<T extends System>(systemClass: SystemClass<T>): T | undefined {
        return this.systems.get(systemClass) as (T | undefined);
    }

    @bind public add<T extends System>(systemClass: SystemClass<T>): T {
        if (this.systems.has(systemClass)) {
            throw new Error("Can't add system twice.");
        }
        const system = new systemClass(this.entityManager);
        this.systems.set(systemClass, system);
        return system;
    }

    @bind public forEach(callback: (system: System) => void): void {
        this.systems.forEach(system => callback(system));
    }

    @bind public update(milliseconds: number): void {
        this.forEach(system => system.updateFromGameLoop(milliseconds));
    }
}

