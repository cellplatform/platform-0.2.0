import { Package } from './build/Package.mjs';
import { Typescript } from './build/Typescript.mjs';
import { Vite } from './build/Vite.mjs';
import { execa, fs, t } from './common/index.mjs';
import { Template } from './Template.mjs';

/**
 * ESM module builder.
 * Uses:
 *  - tsc (typescript)
 *  - Vite => Rollup
 */
export const Builder = {
  /**
   * Run a build that:
   *
   *    - Builds type definitions [.d.ts] output into a root /types folder.
   *    - Bundles typescript into production distribution (ESM, via Vite/Rollup)
   *    - Updates [packag.json] with ESM {exports} and typescript {typesVersions}.
   *
   */
  async build(dir: t.PathString, options: { silent?: boolean } = {}) {
    const { silent = false } = options;
    const exitOnError = true;

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

  /**
   * Run unit-tests
   */
  async test(
    dir: t.PathString,
    options: { watch?: boolean; ui?: boolean; coverage?: boolean } = {},
  ) {
    const { watch = true, coverage = false, ui = false } = options;

    const args = [`--watch=${watch}`];
    if (coverage) args.push('--coverage');
    if (ui) args.push('--ui');

    const cmd = 'vitest';
    const res = await execa(cmd, args, { cwd: dir, stdio: 'inherit' });
    const ok = res.exitCode === 0;

    return { ok, cmd, args };
  },
};

/**
 * TODO 🐷
 * - Workers
 * - BUG: Ensure [Rollup:Manifest] generates with Web.Worker
 * - manifest (Cell, Hash, TypeRefs)
 *
 */
