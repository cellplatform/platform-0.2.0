import { build } from 'vite';

import { fs, t, Util } from '../common/index.mjs';
import { Template } from '../Template.mjs';
import { Paths } from '../Paths.mjs';

/**
 * Refs:
 * - https://vitejs.dev/guide/api-javascript.html#build
 */
export const Vite = {
  /**
   * Generate the [dist] module compilation output.
   * Run the ESM/JS bundler (Vite => Rollup)
   */
  async build(root: t.DirString, options: { silent?: boolean } = {}) {
    root = fs.resolve(root);
    const logLevel = options.silent ? 'silent' : undefined;

    await Template.ensureExists('vite.config', root);
    await build({ root, logLevel });
    return { ok: true, errorCode: 0 };
  },

  /**
   * Loads the vite generate manifest fiile
   */
  async loadManifest(root: t.DirString) {
    const path = fs.join(root, Paths.viteManifest);
    if (!(await fs.pathExists(path))) throw new Error(`Vite manifest not found: ${path}`);
    const manifest = await Util.Json.load<t.ViteManifest>(path);
    const files = Object.keys(manifest).map((path) => manifest[path]);
    return { manifest, files };
  },
};
