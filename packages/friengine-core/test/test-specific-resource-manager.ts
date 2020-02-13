import {
    ResourceHandle,
    ResourceManager,
    Constructable,
    LoadStatus,
    BaseSpecificResourceManager,
} from "../src";

describe("SpecificResourceManager", () => {
    interface TestOptions {
        value: string;
    }

    type TestManager = BaseSpecificResourceManager<string, TestOptions>;

    let resourceType1: symbol;
    let resourceType2: symbol;
    let loadFn1: jest.Mock<any>;
    let loadFn2: jest.Mock<any>;
    let TestManager1: Constructable<TestManager, [ResourceManager]>;
    let TestManager2: Constructable<TestManager, [ResourceManager]>;
    let resourceManager: ResourceManager;
    let testManager1: TestManager;
    let testManager2: TestManager;

    beforeEach(() => {
        resourceType1 = Symbol("ResourceTypeTest1");
        resourceType2 = Symbol("ResourceTypeTest2");
        loadFn1 = jest.fn(({ value }) => new Promise(resolve => setTimeout(() => resolve(value))));
        loadFn2 = jest.fn(({ value }) => new Promise(resolve => setTimeout(() => resolve(value))));

        TestManager1 = class extends BaseSpecificResourceManager<string, TestOptions> {
            protected readonly resourceType = resourceType1;
            protected loader = loadFn1;
        };

        TestManager2 = class extends BaseSpecificResourceManager<string, TestOptions> {
            protected readonly resourceType = resourceType2;
            protected loader = loadFn2;
        };

        resourceManager = new ResourceManager();
        testManager1 = new TestManager1(resourceManager);
        testManager2 = new TestManager2(resourceManager);
    });

    describe("after adding resources two both classes", () => {
        let handle1: ResourceHandle<string>;
        let handle2: ResourceHandle<string>;

        beforeEach(() => {
            handle1 = ResourceManager.add({ type: resourceType1, options: { value: "value 1" } });
            handle2 = ResourceManager.add({ type: resourceType2, options: { value: "value 2" } });
        });

        describe("loading a mixture of known and foreign resource handles", () => {
            beforeEach(() => testManager1.loadAllKnownHandles([ handle1, handle2 ]));

            it("called the loader only once", () => expect(loadFn1).toHaveBeenCalledTimes(1));

            it("called the loader for the correct handle", () => expect(loadFn1).toHaveBeenCalledWith({ value: "value 1"}));
        });

        describe("when loading resources individually", () => {
            beforeEach(() => testManager1.load(handle1));

            it("resource has state in progress", () =>
                expect(testManager1.getResource(handle1).status).toBe(LoadStatus.IN_PROGRESS));

            describe("after the loading has been done", () => {
                beforeEach(() => testManager1.waitUntilFinished());

                it("resource has state done", () =>
                    expect(testManager1.getResource(handle1).status).toBe(LoadStatus.DONE));
            });
        });

        describe("after loading all resources for manager 1", () => {
            beforeEach(async () => {
                testManager1.loadAll();
                await testManager1.waitUntilFinished();
            });

            it("can get data for resource", () => expect(testManager1.get(handle1)).toBe("value 1"));

            it("can get resource", () => expect(testManager1.getResource(handle1).status).toBe(LoadStatus.DONE));

            describe("after loading all resources for manager 2", () => {
                beforeEach(async () => {
                    testManager2.loadAll();
                    await resourceManager.waitUntilFinished();
                });

                it("can get data for resource", () => expect(testManager2.get(handle2)).toBe("value 2"));

                it("can get resource", () => expect(testManager2.getResource(handle2).status).toBe(LoadStatus.DONE));
            });
        });
    });
});
