export * from './TestSuite.helpers/types.mjs';

type Id = string;
type Anything = void | any;
type Milliseconds = number;
type Ctx = Record<string, unknown>;
type IgnoredResponse = any | Promise<any>;

export type TestModifier = 'skip' | 'only';

export type BundleImport = TestSuiteModel | SpecImport | Promise<any>;
export type SpecImport = Promise<{ default: any }>;
export type SpecImports = { [namespace: string]: () => SpecImport };

/**
 * BDD ("behavior driven develoment") style test configuration API.
 */
export type Test = {
  Is: TestIs;
  describe: TestSuiteDescribe;
  bundle(items: BundleImport | BundleImport[]): Promise<TestSuiteModel>;
  bundle(description: string, items: BundleImport | BundleImport[]): Promise<TestSuiteModel>;
  run(items: BundleImport | BundleImport[]): Promise<TestSuiteRunResponse>;
  run(description: string, items: BundleImport | BundleImport[]): Promise<TestSuiteRunResponse>;
};

export type TestIs = {
  promise(input?: any): boolean;
  test(input?: any): boolean;
  suite(input?: any): boolean;
};

/**
 * A suite ("set") of tests.x
 */
export type TestSuite = {
  id: Id;
  timeout(value: Milliseconds): TestSuite;
  describe: TestSuiteDescribe;
  it: TestSuiteIt;
};

export type TestSuiteDescribe = TestSuiteDescribeDef & {
  skip: TestSuiteDescribeDef;
  only: TestSuiteDescribeDef;
};
export type TestSuiteDescribeDef = (
  description: string,
  handler?: TestSuiteHandler,
) => TestSuiteModel;

export type TestSuiteIt = TestSuiteItDef & { skip: TestSuiteItDef; only: TestSuiteItDef };
export type TestSuiteItDef = (description: string, handler?: TestHandler) => TestModel;

export type TestSuiteHandler = (e: TestSuite) => Anything | Promise<Anything>;
export type TestHandler = (e: TestHandlerArgs) => Anything | Promise<Anything>;
export type TestHandlerArgs = {
  id: Id;
  description: string;
  timeout(value: Milliseconds): TestHandlerArgs;
  ctx?: Ctx;
};

/**
 * Model: Test
 */
export type TestModel = {
  kind: 'Test';
  parent: TestSuiteModel;
  id: Id;
  run: TestRun;
  description: string;
  handler?: TestHandler;
  modifier?: TestModifier;
  clone(): TestModel;
  toString(): string;
};

export type TestRun = (options?: TestRunOptions) => Promise<TestRunResponse>;
export type TestRunOptions = {
  timeout?: Milliseconds;
  excluded?: TestModifier[];
  ctx?: Ctx;
  before?: BeforeRunTest;
  after?: AfterRunTest;
};
export type TestRunResponse = {
  id: Id;
  tx: Id; // Unique ID for the individual test run operation.
  ok: boolean;
  description: string;
  elapsed: Milliseconds;
  timeout: Milliseconds;
  excluded?: TestModifier[];
  error?: Error;
};

/**
 * Model: Test Suite
 */

export type TestSuiteModel = TestSuite & {
  kind: 'TestSuite';
  state: TestSuiteModelState;
  run: TestSuiteRun;
  merge(...suites: TestSuiteModel[]): Promise<TestSuiteModel>;
  init(): Promise<TestSuiteModel>;
  clone(): Promise<TestSuiteModel>;
  toString(): string;
};

export type TestSuiteModelState = {
  parent?: TestSuiteModel;
  ready: boolean; // true after [init] has been run.
  description: string;
  handler?: TestSuiteHandler;
  tests: TestModel[];
  children: TestSuiteModel[];
  timeout?: Milliseconds;
  modifier?: TestModifier;
};

export type TestSuiteRun = (options?: TestSuiteRunOptions) => Promise<TestSuiteRunResponse>;
export type TestSuiteRunOptions = {
  timeout?: number;
  deep?: boolean;
  ctx?: Ctx;
  only?: TestModel['id'][]; // Override: a set of spec IDs to filter on, excluding all others.
  beforeEach?: BeforeRunTest;
  afterEach?: AfterRunTest;
};
export type TestSuiteRunResponse = {
  id: Id;
  tx: Id; // Unique ID for the individual suite run operation.
  ok: boolean;
  description: string;
  elapsed: Milliseconds;
  tests: TestRunResponse[];
  children: TestSuiteRunResponse[];
};

/**
 * Handler that runs before/after a test is run.
 */
export type BeforeRunTest = (e: BeforeRunTestArgs) => IgnoredResponse;
export type BeforeRunTestArgs = {
  id: Id;
  description: string;
};

export type AfterRunTest = (e: AfterRunTestArgs) => IgnoredResponse;
export type AfterRunTestArgs = {
  id: Id;
  description: string;
  elapsed: Milliseconds;
};
