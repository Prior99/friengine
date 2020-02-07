import { Component } from "../../src";

export function createComponent() {
    return class SomeComponent implements Component {
        constructor(private value = 0) {}

        clone(): Component {
            return new SomeComponent(this.value);

        }

        equals(other: SomeComponent): boolean {
            return this.value === other.value;
        }
    };
}