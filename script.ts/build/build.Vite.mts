import { build } from 'vite';
import { fs, t } from '../common.mjs';
import { Package } from './build.Package.mjs';

/**
 * Refs:
 * - https://vitejs.dev/guide/api-javascript.html#build
 */
export const Vite = {
  /**
   * Generate the [dist] module compilation output.
   * Run the ESM/JS bundler (Vite => Rollup)
   */
  async build(rootDir: t.PathString) {
    const root = fs.resolve(rootDir);
    await build({ root });
    await Package.update(root, { save: true });
  },
};
