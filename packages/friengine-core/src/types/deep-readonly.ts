// An interface for making every property on an object recursively readonly.
export type DeepReadonlyObject<T> = {
    readonly [key in keyof T]: DeepReadonly<T[key]>;
};

// An interface for making an array recursively readonly.
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {} // eslint-disable-line

export type DeepReadonly<T> =
    // Check whether the current type is an array, an object or a function / primitive and apply
    // the corresponding recursive readonly types accordingly.
    T extends Date ? T :
    T extends Function ? T : // tslint:disable-line
    T extends Array<infer ElementType> ? DeepReadonlyArray<ElementType> :
    T extends object ? DeepReadonlyObject<T> :
    // Primitive types have already been marked as readonly on the parent type (ReadonlyEntity) and
    // hence can be ignored.
    T;

export type ReadonlyEntity<T> = {
    // Redeclare every property on this entity as readonly and apply the
    // recursive type to make all nested properties readonly as well.
    readonly [key in keyof T]: DeepReadonly<T[key]>;
};
