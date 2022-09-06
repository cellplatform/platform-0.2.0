import type { TestAPI, SuiteAPI } from 'vitest';
import type { FsDriverFactory } from 'sys.fs/src/types.mjs';

/**
 * Context object passed to the functional specifications.
 */
export type SpecContext = {
  factory: FsDriverFactory;
  describe: SuiteAPI;
  it: TestAPI;
};
