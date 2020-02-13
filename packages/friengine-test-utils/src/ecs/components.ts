import { Component, ComponentClass } from "friengine-ecs";

export function createComponent(name = "TestComponent"): ComponentClass {
    const obj = {
        [name]: class implements Component {
            constructor(private value = 0) { }

            clone(): Component {
                return new obj[name](this.value);

            }

            equals(other: any): boolean { // eslint-disable-line
                return this.value === other.value;
            }
        }
    };
    Object.defineProperty(obj[name], "name", { value: name });
    return obj[name];
}