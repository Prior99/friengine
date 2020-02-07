import { Constructable } from "friengine-core/src";

export type ComponentClass = Constructable<Component, []>;

export interface Component {
    clone(): Component;
    equals(other: Component): boolean;
}