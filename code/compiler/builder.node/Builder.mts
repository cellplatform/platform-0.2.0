import { build } from './Builder.build.mjs';
import { clean } from './Builder.clean.mjs';
import { test } from './Builder.test.mjs';
import { Util } from './common/index.mjs';
import { Paths } from './Paths.mjs';

const { findProjectDirs } = Util;

/**
 * ESM module builder.
 * Uses:
 *  - tsc (typescript)
 *  - Vite => Rollup
 */
export const Builder = {
  build,
  test,
  clean,

  Paths,
  findProjectDirs,
};

/**
 * TODO 🐷
 * - Workers
 * - BUG: Ensure [Rollup:Manifest] generates with Web.Worker
 * - manifest (Cell, Hash, TypeRefs)
 *
 */
