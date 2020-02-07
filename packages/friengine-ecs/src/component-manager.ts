import { Constructable } from "friengine-core";
import { Component } from "./component";
import { bind } from "bind-decorator";

export class ComponentManager {
    private components = new Map<string, Constructable<Component>>();

    @bind public register(componentClass: Constructable<Component>): void {
        if (this.components.has(componentClass.name)) {
            throw new Error("Can't register component twice.");
        }
        this.components.set(componentClass.name, componentClass);
    }

    @bind public getComponentClass(name: string): Constructable<Component> | undefined {
        return this.components.get(name);
    }
}