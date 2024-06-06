import type { ConfigEnv, UserConfigFn } from 'vite';
import { build } from 'vite';

import { Config } from '../../Config';
import { Paths } from '../Paths';
import { Template } from '../Template';
import { Util, fs, type t } from '../common';

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

    // Load base configuration.
    const { config, targets } = await Vite.loadConfig(root);
    config.root = root;
    if (options.silent) config.logLevel = 'silent';

    const targetConfig = (target: t.ViteTarget) => {
      const clone = Config.target.apply(Config.target.reset(config), target);
      clone.mode = 'production';
      clone.build!.outDir = Paths.outDir.target(target);
      return clone;
    };

    for (const target of targets) {
      const config = targetConfig(target);
      await build({
        ...config, //         <== NB: The configuration is being passed explicitly as an object.
        configFile: false, // <==     This flag tells Vite to ignore the [vite.config] file and not build twice.
      });
    }

    // Finish up.
    return { ok: true, errorCode: 0 };
  },

  /**
   * Loads the vite generated manifest file.
   */
  async loadManifest(dist: t.DirString) {
    const path = fs.join(dist, Paths.viteBuildManifest);
    if (!(await fs.pathExists(path))) throw new Error(`Vite manifest not found: ${path}`);
    const manifest = await Util.Json.load<t.ViteManifest>(path);
    const files = Object.keys(manifest).map((path) => manifest[path]);
    return { manifest, files };
  },

  /**
   * Dynamically load the [config.mts] function.
   */
  async loadConfig(root: t.DirString, env?: ConfigEnv) {
    root = fs.resolve(root);
    await Template.ensureExists('config', root);

    const path = fs.join(root, Paths.tmpl.config);
    const fn = (await import(path)).default as UserConfigFn;
    if (typeof fn !== 'function')
      throw new Error(`The Vite configuration function has not been default exported. ${path}`);

    const args = env ?? { command: 'build', mode: 'production' };
    const config = await Promise.resolve(fn(args));

    const targets = Config.target.get(config);
    if (targets.length === 0) {
      throw new Error(`The module configuration did not specify a target. ${path}`);
    }

    return { config, targets };
  },

  /**
   * Remove all generated build manifest files.
   */
  async deleteBuildManifests(root: t.DirString) {
    const pattern = fs.resolve(root, '**', Paths.viteBuildManifest);
    const paths = await fs.glob(pattern);
    await Promise.all(paths.map((path) => fs.remove(path)));
  },
};
