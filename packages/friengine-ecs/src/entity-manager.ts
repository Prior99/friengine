import { numericalId } from "friengine-core";
import { bind } from "bind-decorator";
import { Entity } from "./entity";
import { ComponentClass } from "./component";
import { ComponentManager } from "./component-manager";

export interface CreateEntityOptions {
    components?: ComponentClass[];
}

export class EntityManager {
    constructor(private componentManager: ComponentManager) { }

    public serial: number = numericalId();

    private entities = new Map<number, Entity>();
    private indexComponents = new Map<ComponentClass, Set<number>>();

    @bind public createEntity({ components: componentClasses }: CreateEntityOptions = {}): Entity {
        const id = numericalId();
        const entity = new Entity(id, this.serial);
        if (componentClasses) {
            componentClasses.forEach(entity.addComponent);
        }
        this.addEntity(entity)
        return entity;
    }

    public addEntity(entity: Entity): void {
        while (this.entities.has(entity.id)) {
            entity.id = numericalId();
        }
        this.entities.set(entity.id, entity);
        this.reindexEntity(entity);
    }

    @bind public forEach(callback: (entity: Entity) => void): void {
        this.entities.forEach(entity => callback(entity));
    }

    @bind public filter(callback: (entity: Entity) => boolean): Entity[] {
        const result: Entity[] = [];
        for (const entry of this.entities.entries()) {
            if (callback(entry[1])) {
                result.push(entry[1]);
            }
        }
        return result;
    }

    @bind public map<T>(callback: (entity: Entity) => T): T[] {
        const result: T[] = [];
        for (const entry of this.entities.entries()) {
            result.push(callback(entry[1]));
        }
        return result;
    }

    @bind public withComponents(...componentClasses: ComponentClass[]): Entity[] {
        return this.filter(entity => {
            for (const componentClass of componentClasses) {
                if (!this.indexComponents.has(componentClass)) {
                    return false;
                }
                if (!this.indexComponents.get(componentClass)!.has(entity.id)) {
                    return false;
                }
            }
            return true;
        });
    }

    @bind private deleteEntity(entity: Entity): void {
        this.entities.delete(entity.id);
        this.indexComponents.forEach(ids => {
            if (ids.has(entity.id)) {
                ids.delete(entity.id);
            }
        });
    }

    @bind private reindexEntity(entity: Entity): void {
        this.indexComponents.forEach((ids, componentClass) => {
            const hasComponent = entity.hasComponent(componentClass);
            const isIndexed = ids.has(entity.id);
            if (isIndexed === hasComponent) {
                return;
            }
            if (hasComponent) {
                ids.add(entity.id);
            } else {
                ids.delete(entity.id);
            }
        });
        entity.componentClasses.forEach(componentClass => {
            if (!this.indexComponents.has(componentClass)) {
                this.indexComponents.set(componentClass, new Set([entity.id]));
            }
        });
    }

    @bind public update(): void {
        const entitiesToDelete: Entity[] = [];
        this.forEach(entity => {
            if (!entity.dirty) {
                return;
            }
            if (entity.markedForDeletion) {
                entitiesToDelete.push(entity);
            } else { // if (entity.componentsChanged)
                this.reindexEntity(entity);
            }
        });
        entitiesToDelete.forEach(this.deleteEntity);
    }

    @bind public findOne(...componentClasses: ComponentClass[]): Entity | undefined {
        return this.withComponents(...componentClasses)[0];
    }

    @bind public duplicate(id: number): Entity {
        const original = this.entities.get(id);
        if (!original) {
            throw new Error("Attempted to clone entity of unknown id.");
        }
        const clone = original.clone();
        this.addEntity(clone);
        return clone;
    }
}
