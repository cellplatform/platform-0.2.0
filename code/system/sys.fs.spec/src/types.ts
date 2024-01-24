import type * as t from './common/t';

import type { FsDriverFactory } from 'sys.fs/src/types';

type DirString = string;

/**
 * Context object passed to the functional specifications.
 */
export type SpecContext = {
  root: DirString; // root directory.
  factory: FsDriverFactory;
  describe: t.SpecSuite;
  it: t.SpecTest;
};
