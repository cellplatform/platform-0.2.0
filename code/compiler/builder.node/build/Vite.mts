import { build } from 'vite';

import { fs, t } from '../common/index.mjs';
import { Template } from '../Template.mjs';

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

    await Template.ensureExists('vite.config', rootDir);
    await build({ root, logLevel });
    return { ok: true, errorCode: 0 };
  },
};
