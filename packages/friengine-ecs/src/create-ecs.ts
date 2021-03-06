import { EntityManager } from "./entity-manager";
import { ComponentManager } from "./component-manager";
import { ComponentClass } from "./component";
import { SystemManager } from "./system-manager";
import { SystemClass, System } from "./system";

export interface EcsParts {
    entityManager: EntityManager;
    componentManager: ComponentManager;
    systemManager: SystemManager;
}

export interface CreateEcsOptions {
    systems?: SystemClass<System>[]; 
    components?: ComponentClass[];
}

export function createEcs({ systems, components }: CreateEcsOptions = {}): EcsParts {
    const componentManager = new ComponentManager();
    const entityManager = new EntityManager(componentManager);
    const systemManager = new SystemManager(entityManager);
    if (components) {
        components.forEach(componentManager.add);
    }
    if (systems) {
        systems.forEach(systemManager.add);
    }
    return { componentManager, entityManager, systemManager };
}