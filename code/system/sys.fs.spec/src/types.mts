import type { SpecSuite, SpecTest } from 'sys.test/src/types.mjs';
import type { FsDriverFactory } from 'sys.fs/src/types.mjs';

type DirPathString = string;

/**
 * Context object passed to the functional specifications.
 */
export type SpecContext = {
  root: DirPathString; // root directory.
  factory: FsDriverFactory;
  describe: SpecSuite;
  it: SpecTest;
};
