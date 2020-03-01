import { Map2d } from "./map-2d";

export enum Map2dParserStatus {
    ERROR = "error",
    SUCCESS = "success",
}

export interface SuccessMap2dParserResult<TResource> {
    status: Map2dParserStatus.SUCCESS;
    map: Map2d<TResource>;
}

export interface ErrorMap2dParserResult {
    status: Map2dParserStatus.ERROR;
}

export type Map2dParserResult<TResource> = SuccessMap2dParserResult<TResource> | ErrorMap2dParserResult;

export type Map2dParser = <TResource>(input: unknown) => Map2dParserResult<TResource>;
