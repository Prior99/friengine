import {
    ResourceHandle,
    DoneResource,
    createSpecificResourceManager,
    Resource,
    ResourceManager,
    SpecificResourceManager,
    SpecificResourceManagerConfig,
    Constructable,
    LoadStatus,
} from "../src";

describe("SpecificResourceManager", () => {
    interface TestOptions {
        value: string;
    }

    interface TestManager extends SpecificResourceManager<string, TestOptions> {
        load(handle: ResourceHandle<string>): Resource<string>;
        loadAll(): Promise<DoneResource<string>[]>;
    }

    let resourceType1: symbol;
    let resourceType2: symbol;
    let testManager1Config: SpecificResourceManagerConfig<string, TestOptions>;
    let testManager2Config: SpecificResourceManagerConfig<string, TestOptions>;
    let loadFn1: jest.Mock<any>;
    let loadFn2: jest.Mock<any>;
    let TestManager1: Constructable<TestManager, [ResourceManager]>;
    let TestManager2: Constructable<TestManager, [ResourceManager]>;
    let resourceManager: ResourceManager;
    let testManager1: TestManager;
    let testManager2: TestManager;
    let spyAdd: jest.SpyInstance<any>;

    beforeEach(() => {
        spyAdd = jest.spyOn(ResourceManager, "add");
        resourceType1 = Symbol("ResourceTypeTest1");
        resourceType2 = Symbol("ResourceTypeTest2");
        testManager1Config = createSpecificResourceManager<string, TestOptions>(resourceType1);
        testManager2Config = createSpecificResourceManager<string, TestOptions>(resourceType2);
        loadFn1 = jest.fn(({ value }) => new Promise(resolve => setTimeout(() => resolve(value))));
        loadFn2 = jest.fn(({ value }) => new Promise(resolve => setTimeout(() => resolve(value))));
        TestManager1 = class extends testManager1Config.superClass implements TestManager {
            public load(handle: ResourceHandle<string>): Resource<string> {
                return super.load(handle, loadFn1);
            }

            public async loadAll(): Promise<DoneResource<string>[]> {
                return super.loadAll(loadFn1);
            }
        };

        TestManager2 = class extends testManager2Config.superClass implements TestManager {
            public load(handle: ResourceHandle<string>): Resource<string> {
                return super.load(handle, loadFn2);
            }

            public async loadAll(): Promise<DoneResource<string>[]> {
                return super.loadAll(loadFn2);
            }
        };
        resourceManager = new ResourceManager();
        testManager1 = new TestManager1(resourceManager);
        testManager2 = new TestManager2(resourceManager);
    });

    describe("after adding resources two both classes", () => {
        let handle1: ResourceHandle<string>;
        let handle2: ResourceHandle<string>;

        beforeEach(() => {
            handle1 = testManager1Config.add({ value: "value 1" });
            handle2 = testManager2Config.add({ value: "value 2" });
        });

        it("called add on ResourceManager", () => expect(spyAdd).toHaveBeenCalledTimes(2));

        it("finds all resource handles for manager 1", () => expect(testManager1Config.allHandles()).toHaveLength(1));

        it("finds all resource handles for manager 2", () => expect(testManager2Config.allHandles()).toHaveLength(1));

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
            beforeEach(() => testManager1.loadAll());

            it("can get data for resource", () => expect(testManager1.get(handle1)).toBe("value 1"));

            it("can get resource", () => expect(testManager1.getResource(handle1).status).toBe(LoadStatus.DONE));

            describe("after loading all resources for manager 2", () => {
                beforeEach(() => testManager2.loadAll());

                it("can get data for resource", () => expect(testManager2.get(handle2)).toBe("value 2"));

                it("can get resource", () => expect(testManager2.getResource(handle2).status).toBe(LoadStatus.DONE));
            });
        });
    });
});
