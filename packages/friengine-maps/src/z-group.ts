import { Tile } from "./tile";

export class ZGroup<TResource> {
    constructor(public tiles: Tile<TResource>[], zIndex: number) {}
}

export class ZGroups<TResource> {
    constructor(public groups: ZGroup<TResource>[]) {}
}