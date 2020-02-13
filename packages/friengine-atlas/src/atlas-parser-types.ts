import { Atlas } from "./atlas";

export enum AtlasParserStatus {
    ERROR = "error",
    SUCCESS = "success",
}

export interface SuccessAtlasParserResult {
    status: AtlasParserStatus.SUCCESS;
    atlas: Atlas;
}

export interface ErrorAtlasParserResult {
    status: AtlasParserStatus.ERROR;
}

export type AtlasParserResult = SuccessAtlasParserResult | ErrorAtlasParserResult;

export type AtlasParser = (input: unknown) => AtlasParserResult;