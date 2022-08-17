import { fs, t } from '../common.mjs';

import { Typescript } from './build.Typescript.mjs';
import { Vite } from './build.Vite.mjs';

/**
 * ESM module builder.
 * Uses:
 *  - tsc (typescript)
 *  - Vite (=> Rollup)
 */
export const Builder = {
  /**
   * Run a build that:
   * - Build type definitions [.d.ts] output into a root /types folder.
   * - Bundle typescript into production distribution (ESM, via Vite/Rollup)
   * - Update [packag.json] with ESM {exports} and typescript {typesVersions}.
   */
  async build(rootDir: t.PathString, options: { silent?: boolean } = {}) {
    const { silent = false } = options;
    const exitOnError = true;

    await Typescript.build(rootDir, { exitOnError });
    await Vite.build(rootDir, { silent });
  },
};

/**
 * TODO 🐷
 * - Workers
 * - manifest (Cell, Hash)
 */
