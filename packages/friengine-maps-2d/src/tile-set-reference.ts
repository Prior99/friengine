export interface TileSetReference {
    url: string;
}

export function isTileSetReference(input: any): input is TileSetReference { // eslint-disable-line
    return typeof input === "object" && typeof input.url === "string";
}
