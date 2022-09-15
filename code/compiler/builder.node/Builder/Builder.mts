import { build } from './Builder.build.mjs';
import { clean } from './Builder.clean.mjs';
import { test } from './Builder.test.mjs';
import { FindUtil as Find } from '../common/index.mjs';
import { Dependencies } from '../op/Dependencies.mjs';
import { Paths } from '../Paths.mjs';

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

  build,
  test,
  clean,
};

/**
 * TODO 🐷
 * - Workers
 * - BUG: Ensure [Rollup:Manifest] generates with Web.Worker
 * - manifest (Cell, Hash, TypeRefs)
 *
 */
