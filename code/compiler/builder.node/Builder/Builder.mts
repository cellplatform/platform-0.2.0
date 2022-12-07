import { FindUtil as Find, PackageJsonUtil as PackageJson } from '../common/index.mjs';
import { Dependencies } from '../op/Dependencies.mjs';
import { Paths } from '../Paths.mjs';
import { build } from './Builder.build.mjs';
import { clean } from './Builder.clean.mjs';
import { test } from './Builder.test.mjs';

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
