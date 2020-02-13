import { ResourceHandle } from "./resource-handle";

export enum LoadResultStatus {
    SUCCESS = "success",
    ERROR = "error",
    DEFERRED = "deferred",
}

export interface DeferredLoadResult {
    status: LoadResultStatus.DEFERRED;
    dependencies: ResourceHandle<unknown>[];
}

export interface ErrorLoadResult {
    status: LoadResultStatus.ERROR;
    error: Error;
}

export interface SuccessLoadResult<TData> {
    status: LoadResultStatus.SUCCESS;
    data: TData;
}

export type LoadResult<T> = DeferredLoadResult | ErrorLoadResult | SuccessLoadResult<T>;
