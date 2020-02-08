import { Constructable } from "friengine-core";
import { Component, ComponentClass } from "./component";
import { bind } from "bind-decorator";

export type EntityClass = Constructable<Entity, [number, number]>;
export class Entity {
    public markedForDeletion = false;
    public componentsChanged = false;
    private components = new Map<ComponentClass, Component>();

    constructor(public id: number, public originalCreator: number) {}

    @bind public addComponent<T extends Component>(componentClass: Constructable<T>): T {
        this.componentsChanged = true;
        const component = new componentClass();
        this.components.set(componentClass, component);
        return component;
    }

    public get dirty(): boolean {
        return this.markedForDeletion || this.componentsChanged;
    }

    @bind public resetDirty(): void {
        this.markedForDeletion = false;
        this.componentsChanged = false;
    }

    @bind public component<T extends Component>(componentClass: Constructable<T>): T | undefined {
        return this.components.get(componentClass) as T;
    }

    @bind public removeComponent<T extends Component>(componentClass: Constructable<T>): void {
        if (!this.components.has(componentClass)) {
            throw new Error("Can't remove component from entity that wasn't added.");
        }
        this.components.delete(componentClass);
    }

    @bind public delete(): void {
        this.markedForDeletion = true;
    }

    public get componentClasses(): ComponentClass[] {
        return Array.from(this.components.keys());
    }

    @bind public forEach(
        callback: <T extends Component>(componentClass: Constructable<T>, component: T) => void,
    ): void {
        this.components.forEach((component, componentClass) => callback(componentClass, component));
    }

    @bind public hasComponent(componentClass: ComponentClass): boolean {
        return this.components.has(componentClass);
    }

    @bind public clone(): Entity {
        const copy = new Entity(this.id, this.originalCreator);
        this.forEach((componentClass, component) => {
            copy.components.set(componentClass, component.clone());
        });
        return copy;
    }
     @bind public isSame(entity: Entity): boolean {
         return this.id === entity.id;
     }

    @bind public equals(entity: Entity): boolean {
        for (let [componentClass] of entity.components.entries()) {
            if (!this.hasComponent(componentClass)) {
                return false;
            }
        }
        for (let [componentClass, component] of this.components.entries()) {
            if (!entity.hasComponent(componentClass)) {
                return false;
            }
            if (!component.equals(entity.component(componentClass)!)) {
                return false;
            }
        }
        return true;
    }
}
