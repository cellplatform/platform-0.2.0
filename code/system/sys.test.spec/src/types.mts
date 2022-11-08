type Id = string;
type Anything = void | any;
type Milliseconds = number;
type Description = string;
type Ctx = Record<string, unknown>;

export type BundleImport = TestSuiteModel | Promise<any>;
export type TestModifier = 'skip' | 'only';

/**
 * BDD ("behavior driven develoment") style test configuration API.
 */
export type Test = {
  describe: TestSuiteDescribe;
  bundle(items: BundleImport | BundleImport[]): Promise<TestSuiteModel>;
  bundle(description: string, items: BundleImport | BundleImport[]): Promise<TestSuiteModel>;
  run(items: BundleImport | BundleImport[]): Promise<TestSuiteRunResponse>;
  run(description: string, items: BundleImport | BundleImport[]): Promise<TestSuiteRunResponse>;
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
  description: Description,
  handler?: TestSuiteHandler,
) => TestSuiteModel;

export type TestSuiteIt = TestSuiteItDef & { skip: TestSuiteItDef; only: TestSuiteItDef };
export type TestSuiteItDef = (description: Description, handler?: TestHandler) => TestModel;

export type TestSuiteHandler = (e: TestSuite) => Anything | Promise<Anything>;
export type TestHandler = (e: TestHandlerArgs) => Anything | Promise<Anything>;
export type TestHandlerArgs = {
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
  description: Description;
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
};
export type TestRunResponse = {
  id: Id;
  ok: boolean;
  description: Description;
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
  description: Description;
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
};
export type TestSuiteRunResponse = {
  id: Id;
  ok: boolean;
  description: Description;
  elapsed: Milliseconds;
  tests: TestRunResponse[];
  children: TestSuiteRunResponse[];
};
