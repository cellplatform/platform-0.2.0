import { Package } from './build/Package.mjs';
import { Typescript } from './build/Typescript.mjs';
import { Vite } from './build/Vite.mjs';
import { test } from './Builder.test.mjs';
import { fs, t } from './common/index.mjs';
import { Template } from './Template.mjs';

/**
 * ESM module builder.
 * Uses:
 *  - tsc (typescript)
 *  - Vite => Rollup
 */
export const Builder = {
  test,

  /**
   * Run a build that:
   *
   *    - Builds type definitions [.d.ts] output into a root /types folder.
   *    - Bundles typescript into production distribution (ESM, via Vite/Rollup)
   *    - Updates [packag.json] with ESM {exports} and typescript {typesVersions}.
   *
   */
  async build(dir: t.PathString, options: { silent?: boolean; exitOnError?: boolean } = {}) {
    const { silent = false, exitOnError = true } = options;

    await Template.ensureBaseline(dir);
    await Typescript.build(dir, { exitOnError });
    await Vite.build(dir, { silent });
    await Package.updateEsm(dir, { save: true });

    if (!options.silent) console.log();
  },

  /**
   * Clean a module of transient build artifacts and temporary data.
   */
  async clean(dir: t.PathString) {
    dir = fs.resolve(dir);
    await fs.remove(fs.join(dir, 'dist'));
    await fs.remove(fs.join(dir, 'types'));
  },
};

/**
 * TODO 🐷
 * - Workers
 * - BUG: Ensure [Rollup:Manifest] generates with Web.Worker
 * - manifest (Cell, Hash, TypeRefs)
 *
 */
