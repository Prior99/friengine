import { ResourceManager, Resource, LoadStatus, DoneResource, ErrorResource } from "../src";

describe("ResourceManager", () => {
    let resourceManager: ResourceManager;
    let type1: Symbol;
    let type2: Symbol;

    const createLoader = (value: string, error = false) => {
        let resolve: (value: string) => void;
        let reject: (err: Error) => void;
        let finish = () => {
            if (error) {
                reject(new Error("Something went wrong"));
            } else {
                resolve(value);
            }
        };
        const promise = new Promise((res: (value: string) => void, rej) => {
            resolve = res;
            reject = rej;
        });
        return {
            load: (): Promise<string> => promise,
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
            expect(resourceManager.waitFor(17)).rejects.toMatchInlineSnapshot(
                `[Error: Can't wait for unknown resource]`,
            ));

        it("is done", () => expect(resourceManager.done).toBe(true));

        it("is done for type1", () => expect(resourceManager.doneForType(type1)).toBe(true));

        it("has no resources for type1", () => expect(resourceManager.search({ type: type1 })).toEqual([]));
    });

    describe("after adding 3 resources", () => {
        let loader1: ReturnType<typeof createLoader>;
        let loader2: ReturnType<typeof createLoader>;
        let loader3: ReturnType<typeof createLoader>;
        let resource1: Resource<string>;
        let resource2: Resource<string>;
        let resource3: Resource<string>;
        let waitForResource2Rejected = false;
        let waitForResource3Resolved1 = false;
        let waitForResource3Resolved2 = false;

        beforeEach(() => {
            loader1 = createLoader("value 1");
            loader2 = createLoader("value 2", true);
            loader3 = createLoader("value 3");
            resource1 = resourceManager.add(type1, loader1);
            resource2 = resourceManager.add(type1, loader2);
            resource3 = resourceManager.add(type2, loader3);
            resourceManager.waitFor(resource2.id).catch(() => (waitForResource2Rejected = true));
            resourceManager.waitFor(resource3.id).then(() => (waitForResource3Resolved1 = true));
            resourceManager.waitFor(resource3.id).then(() => (waitForResource3Resolved2 = true));
        });

        it("is loading resource 1", () => expect(resource1.status).toBe(LoadStatus.IN_PROGRESS));

        it("is loading resource 2", () => expect(resource2.status).toBe(LoadStatus.IN_PROGRESS));

        it("is not loading resource 3", () => expect(resource3.status).toBe(LoadStatus.PENDING));

        it("returns all resources for type1", () =>
            expect(resourceManager.search({ type: type1 })).toEqual([resource1, resource2]));

        it("is not done", () => expect(resourceManager.done).toBe(false));

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

            it("promise 1 waiting for resource 3 didn't resolve", () => expect(waitForResource3Resolved1).toBe(false));

            it("promise 2 waiting for resource 3 didn't resolve", () => expect(waitForResource3Resolved2).toBe(false));

            it("promise waiting for resource 2 didn't reject", () => expect(waitForResource2Rejected).toBe(false));

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

                describe("after resource 3 finished loading", () => {
                    beforeEach(() => loader3.finish());

                    it("stored the result on the resource", () =>
                        expect((resource3 as DoneResource<string>).data).toBe("value 3"));

                    it("is not loading resource 1", () => expect(resource1.status).toBe(LoadStatus.DONE));

                    it("is not loading resource 2", () => expect(resource2.status).toBe(LoadStatus.ERROR));

                    it("is not loading resource 3", () => expect(resource3.status).toBe(LoadStatus.DONE));

                    it("is done", () => expect(resourceManager.done).toBe(true));

                    it("promise 1 waiting for resource 3 resolved", () => expect(waitForResource3Resolved1).toBe(true));

                    it("promise 2 waiting for resource 3 resolved", () => expect(waitForResource3Resolved2).toBe(true));

                    it("promise waiting for resource 2 rejected", () => expect(waitForResource2Rejected).toBe(true));
                });
            });
        });
    });
});
