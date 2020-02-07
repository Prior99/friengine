import { Constructable } from "friengine-core";
import { Component, ComponentClass } from "./component";
import { bind } from "bind-decorator";

export class ComponentManager {
    private components = new Map<string, ComponentClass>();

    @bind public add(componentClass: ComponentClass): void {
        if (this.components.has(componentClass.name)) {
            throw new Error("Can't register component twice.");
        }
        this.components.set(componentClass.name, componentClass);
    }

    @bind public byName(name: string): ComponentClass | undefined {
        return this.components.get(name);
    }
}