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
  async build(rootDir: t.PathString, options: { silent?: boolean } = {}) {
    const root = fs.resolve(rootDir);
    const logLevel = options.silent ? 'silent' : undefined;

    await build({
      root,
      logLevel,
      build: { manifest: true },
    });

    await Package.update(root, { save: true });
  },
};
