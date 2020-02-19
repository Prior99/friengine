export const commonBadTypes = [null, undefined, "", 0, false, true, {}, []];

export const layerBase = {
    id: 9,
    name: "layer-base",
    visible: true,
    opacity: 1,
    x: 0,
    y: 0,
};

export const layerTiles = {
    data: [],
    width: 1,
    height: 1,
    ...layerBase,
};

export const layerObjects = {
    draworder: "topdown",
    type: "objectgroup",
    objects: [],
    ...layerBase,
};

export const tileSetIndex = { firstgid: 9 };

export const tileSetReference = { source: "some-source.png" };

export const map = {
    compression: 0,
    infinite: false,
    layers: [],
    nextlayerid: 10,
    nextobjectid: 3,
    orientation: "orthogonal",
    tiledversion: "1.3.2",
    tileheight: 16,
    tilewidth: 16,
    tilesets: [],
    type: "map",
    version: 1.2,
};

export const objectBase = {
    rotation: 0,
    visible: true,
    type: "some-type",
    name: "some-name",
    id: 10,
    x: 11,
    y: 12.3,
    width: 0,
    height: 10,
};

export const objectPoint = {
    ...objectBase,
    point: true,
};

export const objectPolygon = {
    ...objectBase,
    polygon: [],
};

export const objectEllipse = {
    ...objectBase,
    ellipse: true,
};

export const objectRect = {
    ...objectBase,
};

export const image = {
    image: "image.png",
    imagewidth: 32,
    imageheight: 32,
};

export const grid = {
    orientation: "orthogonal",
    width: 1,
    height: 1,
};

export const tileSetBase = {
    name: "base",
    version: 1.2,
    type: "tileset",
    tilewidth: 16,
    tileheight: 16,
    tiledversion: "1.3.2",
    tilecount: 4,
};

export const tileSetSheet = {
    ...tileSetBase,
    columns: 2,
    margin: 0,
    spacing: 0,
};

export const tile = {
    ...image,
    id: 18,
};

export const tileSetCollection = {
    ...tileSetBase,
    grid,
    tiles: [],
};