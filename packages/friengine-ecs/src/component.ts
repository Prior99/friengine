import { Constructable } from "friengine-core";

export type ComponentClass = Constructable<Component, []>;

export interface Component {
    clone(): Component;
    equals(other: Component): boolean;
}