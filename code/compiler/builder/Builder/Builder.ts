import { FindUtil as Find, PackageJsonUtil as PackageJson } from '../common';
import { Dependencies } from '../op/Dependencies';
import { Paths } from '../Paths';
import { build } from './Builder.build';
import { clean } from './Builder.clean';
import { test } from './Builder.test';

/**
 * ESM module builder.
 * Uses:
 *  - tsc (typescript)
 *  - Vite => Rollup
 */
export const Builder = {
  Paths,
  Find,
  Dependencies,
  PackageJson,

  build,
  test,
  clean,
};
