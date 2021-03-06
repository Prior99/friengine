import {
    ResourceManager,
    Resource,
    LoadStatus,
    DoneResource,
    ErrorResource,
    ResourceHandle,
    LoadResult,
    LoadResultStatus,
} from "../src";

describe("ResourceManager", () => {
    let resourceManager: ResourceManager;
    let type1: symbol;
    let type2: symbol;

    // eslint-disable-next-line
    const createLoader = (
        value: string,
        type: symbol,
        error = false,
        rejects = true,
        dependencies?: ResourceHandle<unknown>[],
    ) => {
        let hasDeferred = false;

        let resolve: (value: LoadResult<string>) => void;
        let reject: (err: Error) => void;

        const createPromise = (): any =>
            new Promise((res: (value: LoadResult<string>) => void, rej) => {
                resolve = res;
                reject = rej;
            });
        let promise = createPromise();

        const finish = (): any => {
            if (error) {
                if (rejects) {
                    reject(new Error("Something went wrong"));
                } else {
                    resolve({
                        status: LoadResultStatus.ERROR,
                        error: new Error("Something went wrong"),
                    });
                }
            } else if (dependencies && !hasDeferred) {
                dependencies.forEach(dependency => resourceManager.load(dependency, (options: any) => options.load()));
                resolve({ status: LoadResultStatus.DEFERRED, dependencies });
            } else {
                resolve({ status: LoadResultStatus.SUCCESS, data: value });
            }
        };

        return {
            loader: {
                options: {
                    load: async (): Promise<LoadResult<string>> => {
                        const result = await promise;
                        if (result.status === LoadResultStatus.DEFERRED) {
                            hasDeferred = true;
                            promise = createPromise();
                        }
                        return result;
                    },
                },
                type,
            },
            finish,
        };
    };

    beforeEach(() => {
        resourceManager = new ResourceManager(2);
        type1 = Symbol("type1");
        type2 = Symbol("type2");
    });

    describe("initially", () => {
        it("can't wait for unknown resource", () =>
            expect(resourceManager.waitFor({ symbol: Symbol() } as Resource<unknown>)).rejects.toMatchInlineSnapshot(
                `[Error: Can't wait for foreign resource]`,
            ));

        it("is done", () => expect(resourceManager.done).toBe(true));

        it("is done for type1", () => expect(resourceManager.doneForType(type1)).toBe(true));

        it("has no resources for type1", () => expect(resourceManager.search({ type: type1 })).toEqual([]));

        it("getResource throws with an unknown resource", () =>
            expect(() => resourceManager.getResource({ symbol: Symbol() })).toThrowErrorMatchingInlineSnapshot(
                `"Not a resource handle."`,
            ));

        it("loading a resource that hasn't been registered", () =>
            expect(() =>
                resourceManager.load({ symbol: Symbol() }, async () => ({
                    data: undefined,
                    status: LoadResultStatus.SUCCESS,
                })),
            ).toThrowErrorMatchingInlineSnapshot(`"Not a resource handle."`));
    });

    describe("with a resource that returns an error", () => {
        let loader: ReturnType<typeof createLoader>;
        let handle: ResourceHandle<string>;
        let resource: Resource<string>;
        let waitForResource2Rejected = false;

        beforeEach(() => {
            ResourceManager.reset();
            loader = createLoader("value 2", type1, true, false);
            handle = ResourceManager.add(loader.loader);

            resource = resourceManager.load(handle, (options: any) => options.load());
            resourceManager.waitFor(resource).catch(() => (waitForResource2Rejected = true));
            loader.finish();
        });

        it("promise waiting for resource rejects", () => expect(waitForResource2Rejected).toBe(true));
    });

    describe("after adding 3 resources", () => {
        let loader1: ReturnType<typeof createLoader>;
        let loader2: ReturnType<typeof createLoader>;
        let loader3: ReturnType<typeof createLoader>;
        let handle1: ResourceHandle<string>;
        let handle2: ResourceHandle<string>;
        let handle3: ResourceHandle<string>;
        let resource1: Resource<string>;
        let resource2: Resource<string>;
        let resource3: Resource<string>;
        let waitForResource2Rejected = false;
        let waitForResource3Resolved1 = false;
        let waitForResource3Resolved2 = false;

        beforeEach(() => {
            ResourceManager.reset();
            loader1 = createLoader("value 1", type1);
            loader3 = createLoader("value 3", type2);
            handle1 = ResourceManager.add(loader1.loader);
            handle3 = ResourceManager.add(loader3.loader);
        });

        describe("adding a resource again", () => {
            let handle1Copy: ResourceHandle<string>;

            beforeEach(() => handle1Copy = ResourceManager.add(loader1.loader));

            it("returns the exact same handle", () => expect(handle1Copy.symbol).toBe(handle1.symbol));
        });

        it("can get all resource handles for a type", () =>
            expect(ResourceManager.getHandlesForType(type1)).toEqual([handle1]));

        it("getResource throws with a resource that is not loaded", () =>
            expect(() => resourceManager.getResource(handle2)).toThrowErrorMatchingInlineSnapshot(
                `"Cannot read property 'symbol' of undefined"`,
            ));

        it("get throws with a resource that is not fully loaded", () =>
            expect(() => resourceManager.get(handle1)).toThrowErrorMatchingInlineSnapshot(
                `"Resource handle not loaded in this instance."`,
            ));

        describe("when loading all resources individually", () => {
            beforeEach(() => {
                loader2 = createLoader("value 2", type1, true);
                handle2 = ResourceManager.add(loader2.loader);

                resource1 = resourceManager.load(handle1, (options: any) => options.load());
                resource2 = resourceManager.load(handle2, (options: any) => options.load());
                resource3 = resourceManager.load(handle3, (options: any) => options.load());
                resourceManager.waitFor(resource2).catch(() => (waitForResource2Rejected = true));
                resourceManager.waitFor(resource3).then(() => (waitForResource3Resolved1 = true));
                resourceManager.waitFor(resource3).then(() => (waitForResource3Resolved2 = true));
            });

            it("get throws with a resource that is not fully loaded", () =>
                expect(() => resourceManager.get(handle1)).toThrowErrorMatchingInlineSnapshot(
                    `"Resource has not yet finished loading."`,
                ));

            it("is loading resource 1", () => expect(resource1.status).toBe(LoadStatus.IN_PROGRESS));

            it("is loading resource 2", () => expect(resource2.status).toBe(LoadStatus.IN_PROGRESS));

            it("is not loading resource 3", () => expect(resource3.status).toBe(LoadStatus.PENDING));

            it("returns all resources for type1", () =>
                expect(resourceManager.search({ type: type1 })).toEqual([resource1, resource2]));

            it("returns all resources", () =>
                expect(resourceManager.search()).toEqual([resource1, resource2, resource3]));

            it("is not done", () => expect(resourceManager.done).toBe(false));

            it("is not done for resource", () => expect(resourceManager.resourceDone(handle1)).toBe(false));

            it("is not done for type type1", () =>
                expect(resourceManager.search({ type: type1, status: LoadStatus.DONE })).toHaveLength(0));

            it("promise 1 waiting for resource 3 didn't resolve", () => expect(waitForResource3Resolved1).toBe(false));

            it("promise 2 waiting for resource 3 didn't resolve", () => expect(waitForResource3Resolved2).toBe(false));

            it("promise waiting for resource 2 didn't reject", () => expect(waitForResource2Rejected).toBe(false));

            describe("after resource 1 finished loading", () => {
                beforeEach(() => loader1.finish());

                it("stored the result on the resource", () =>
                    expect((resource1 as DoneResource<string>).data).toBe("value 1"));

                it("is not loading resource 1", () => expect(resource1.status).toBe(LoadStatus.DONE));

                it("is loading resource 2", () => expect(resource2.status).toBe(LoadStatus.IN_PROGRESS));

                it("is loading resource 3", () => expect(resource3.status).toBe(LoadStatus.IN_PROGRESS));

                it("is done for type type1", () => expect(resourceManager.doneForType(type1)).toBe(false));

                it("is not done", () => expect(resourceManager.done).toBe(false));

                it("is done for resource", () => expect(resourceManager.resourceDone(handle1)).toBe(true));

                it("promise 1 waiting for resource 3 didn't resolve", () =>
                    expect(waitForResource3Resolved1).toBe(false));

                it("promise 2 waiting for resource 3 didn't resolve", () =>
                    expect(waitForResource3Resolved2).toBe(false));

                it("promise waiting for resource 2 didn't reject", () => expect(waitForResource2Rejected).toBe(false));

                it("waiting for resource 1 immediately resolved", () =>
                    expect(resourceManager.waitFor(resource1)).resolves.toEqual(resource1));

                it("can get the data", () => expect(resourceManager.get(handle1)).toBe("value 1"));

                describe("after resource 2 finished loading", () => {
                    beforeEach(() => loader2.finish());

                    it("stored the error on the resource", () =>
                        expect((resource2 as ErrorResource<string>).error).toMatchInlineSnapshot(
                            `[Error: Something went wrong]`,
                        ));

                    it("is not loading resource 1", () => expect(resource1.status).toBe(LoadStatus.DONE));

                    it("is not loading resource 2", () => expect(resource2.status).toBe(LoadStatus.ERROR));

                    it("is done for type type1", () => expect(resourceManager.doneForType(type1)).toBe(true));

                    it("is loading resource 3", () => expect(resource3.status).toBe(LoadStatus.IN_PROGRESS));

                    it("is not done", () => expect(resourceManager.done).toBe(false));

                    it("promise 1 waiting for resource 3 didn't resolve", () =>
                        expect(waitForResource3Resolved1).toBe(false));

                    it("promise 2 waiting for resource 3 didn't resolve", () =>
                        expect(waitForResource3Resolved2).toBe(false));

                    it("promise waiting for resource 2 rejected", () => expect(waitForResource2Rejected).toBe(true));

                    it("waiting for resource 2 immediately rejects", () =>
                        expect(resourceManager.waitFor(resource2)).rejects.toEqual((resource2 as any).error));

                    describe("after resource 3 finished loading", () => {
                        beforeEach(() => loader3.finish());

                        it("stored the result on the resource", () =>
                            expect((resource3 as DoneResource<string>).data).toBe("value 3"));

                        it("is not loading resource 1", () => expect(resource1.status).toBe(LoadStatus.DONE));

                        it("is not loading resource 2", () => expect(resource2.status).toBe(LoadStatus.ERROR));

                        it("is not loading resource 3", () => expect(resource3.status).toBe(LoadStatus.DONE));

                        it("is done", () => expect(resourceManager.done).toBe(true));

                        it("promise 1 waiting for resource 3 resolved", () =>
                            expect(waitForResource3Resolved1).toBe(true));

                        it("promise 2 waiting for resource 3 resolved", () =>
                            expect(waitForResource3Resolved2).toBe(true));

                        it("promise waiting for resource 2 rejected", () =>
                            expect(waitForResource2Rejected).toBe(true));
                    });
                });
            });
        });
    });

    describe("dependencies", () => {
        let loaders: ReturnType<typeof createLoader>[];
        let handle1: ResourceHandle<string>;
        let handle2: ResourceHandle<string>;
        let handle3: ResourceHandle<string>;
        let handle4: ResourceHandle<string>;

        beforeEach(() => {
            loaders = [
                createLoader("value 1", type1),
                createLoader("value 2", type1),
                createLoader("value 3", type2),
                createLoader("value 4", type2),
            ];
            ResourceManager.reset();
            handle1 = ResourceManager.add(loaders[0].loader);
            handle2 = ResourceManager.add(loaders[1].loader);
            handle3 = ResourceManager.add({
                ...loaders[2].loader,
                dependencies: [handle1, handle2],
            });
            handle4 = ResourceManager.add({
                ...loaders[3].loader,
                dependencies: [handle3],
            });
        });

        describe("with deferred dependencies", () => {
            let handle5: ResourceHandle<string>;
            let handle6: ResourceHandle<string>;

            beforeEach(() => {
                loaders.push(createLoader("value 5", type1, false, true, [handle4]));
                handle5 = ResourceManager.add(loaders[4].loader);
                loaders.push(createLoader("value 6", type1, false, true, [handle5]));
                handle6 = ResourceManager.add(loaders[5].loader);
            });

            it("doesn't know handle 1", () => expect(resourceManager.knowsHandle(handle1)).toBe(false));

            it("doesn't know handle 2", () => expect(resourceManager.knowsHandle(handle2)).toBe(false));

            it("doesn't know handle 3", () => expect(resourceManager.knowsHandle(handle3)).toBe(false));

            it("doesn't know handle 4", () => expect(resourceManager.knowsHandle(handle4)).toBe(false));

            it("doesn't know handle 5", () => expect(resourceManager.knowsHandle(handle5)).toBe(false));

            it("doesn't know handle 6", () => expect(resourceManager.knowsHandle(handle6)).toBe(false));

            describe("when loading resource 6", () => {
                beforeEach(() => resourceManager.load(handle6, (options: any) => options.load()));

                it("is in progress", () =>
                    expect(resourceManager.getResource(handle6).status).toBe(LoadStatus.IN_PROGRESS));

                it("knows handle 6", () => expect(resourceManager.knowsHandle(handle6)).toBe(true));

                describe("after resource 6 finished loading", () => {
                    beforeEach(() => loaders[5].finish());

                    it("is pending", () =>
                        expect(resourceManager.getResource(handle6).status).toBe(LoadStatus.PENDING));

                    it("can't load resource 6", () =>
                        expect(resourceManager.isResourceLoadable(resourceManager.getResource(handle6))).toBe(false));

                    it("knows handle 5", () => expect(resourceManager.knowsHandle(handle5)).toBe(true));

                    describe("after resource 5 finished loading", () => {
                        beforeEach(() => loaders[4].finish());

                        it("resource 5 is pending", () =>
                            expect(resourceManager.getResource(handle5).status).toBe(LoadStatus.PENDING));

                        it("can't load resource 5", () =>
                            expect(resourceManager.isResourceLoadable(resourceManager.getResource(handle5))).toBe(
                                false,
                            ));

                        it("resource 6 is pending", () =>
                            expect(resourceManager.getResource(handle6).status).toBe(LoadStatus.PENDING));

                        it("knows handle 4", () => expect(resourceManager.knowsHandle(handle4)).toBe(true));

                        describe("after resources 1 - 4 finished loading", () => {
                            beforeEach(async () => {
                                resourceManager.load(handle1, (options: any) => options.load());
                                resourceManager.load(handle2, (options: any) => options.load());
                                resourceManager.load(handle3, (options: any) => options.load());
                                resourceManager.load(handle4, (options: any) => options.load());
                                loaders.slice(0, 4).forEach(loader => loader.finish());
                                await Promise.all(
                                    [handle1, handle2, handle3, handle4]
                                        .map(handle => resourceManager.getResource(handle))
                                        .map(resource => resourceManager.waitFor(resource)),
                                );
                            });

                            it("has loaded resource 1", () => expect(resourceManager.get(handle1)).toBe("value 1"));

                            it("has loaded resource 2", () => expect(resourceManager.get(handle2)).toBe("value 2"));

                            it("has loaded resource 3", () => expect(resourceManager.get(handle3)).toBe("value 3"));

                            it("has loaded resource 4", () => expect(resourceManager.get(handle4)).toBe("value 4"));

                            it("resource 5 is in progress", () =>
                                expect(resourceManager.getResource(handle5).status).toBe(LoadStatus.IN_PROGRESS));

                            it("resource 6 is pending", () =>
                                expect(resourceManager.getResource(handle6).status).toBe(LoadStatus.PENDING));

                            describe("after resource 5 finished loading again", () => {
                                beforeEach(() => loaders[4].finish());

                                it("has loaded resource 5", () => expect(resourceManager.get(handle5)).toBe("value 5"));

                                it("resource 6 is in progress", () =>
                                    expect(resourceManager.getResource(handle6).status).toBe(LoadStatus.IN_PROGRESS));

                                describe("after resource 6 finished loading again", () => {
                                    beforeEach(() => loaders[5].finish());

                                    it("has loaded resource 6", () =>
                                        expect(resourceManager.get(handle6)).toBe("value 6"));
                                });
                            });
                        });
                    });
                });
            });
        });

        describe("with a second resource manager", () => {
            let resource: Resource<string>;

            beforeEach(() => {
                const other = new ResourceManager();
                resource = other.load(handle3, (options: any) => options.load());
            });

            it("can't load foreign resource", () => expect(resourceManager.isResourceLoadable(resource)).toBe(false));
        });

        describe("when loading all resources at once", () => {
            beforeEach(() => {
                resourceManager.load(handle1, (options: any) => options.load());
                resourceManager.load(handle2, (options: any) => options.load());
                resourceManager.load(handle3, (options: any) => options.load());
                resourceManager.load(handle4, (options: any) => options.load());
            });

            describe("after waiting for all resources to have loaded", () => {
                beforeEach(async () => {
                    loaders.forEach(loader => loader.finish());
                    await resourceManager.waitUntilFinished();
                });

                it("has loaded resource 1", () => expect(resourceManager.get(handle1)).toBe("value 1"));

                it("has loaded resource 2", () => expect(resourceManager.get(handle2)).toBe("value 2"));

                it("has loaded resource 3", () => expect(resourceManager.get(handle3)).toBe("value 3"));

                it("has loaded resource 4", () => expect(resourceManager.get(handle4)).toBe("value 4"));
            });
        });
    });
});
