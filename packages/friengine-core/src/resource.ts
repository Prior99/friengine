import { ResourceHandle } from "./resource-handle";
import { LoadResult } from "./load-result";

export enum LoadStatus {
    PENDING = "pending",
    IN_PROGRESS = "in progress",
    DONE = "done",
    ERROR = "error",
}

export interface BaseResource<T> {
    load: () => Promise<LoadResult<T>>;
    status: LoadStatus;
    type: symbol;
    symbol: symbol;
    dependencies: ResourceHandle<unknown>[];
}

export interface DoneResource<T> extends BaseResource<T> {
    status: LoadStatus.DONE;
    data: T;
}

export interface ErrorResource<T> extends BaseResource<T> {
    status: LoadStatus.ERROR;
    error: Error;
}

export interface UnfinishedResource<T> extends BaseResource<T> {
    status: LoadStatus.PENDING | LoadStatus.IN_PROGRESS;
}

export type Resource<T> = DoneResource<T> | ErrorResource<T> | UnfinishedResource<T>;