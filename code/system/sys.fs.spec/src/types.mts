import type { SpecSuite, SpecTest } from 'sys.test/src/types.mjs';
import type { FsDriverFactory } from 'sys.fs/src/types.mjs';

/**
 * Context object passed to the functional specifications.
 */
export type SpecContext = {
  factory: FsDriverFactory;
  describe: SpecSuite;
  it: SpecTest;
};
