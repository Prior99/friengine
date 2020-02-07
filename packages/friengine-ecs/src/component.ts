export interface Component {
    new(): unknown;
    name: string;
    clone(): Component;
    equals(other: Component): boolean;
}