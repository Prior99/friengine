export type Constructable<T, TArgs extends Array<any> = []> = new(...args: TArgs) => T; // eslint-disable-line
