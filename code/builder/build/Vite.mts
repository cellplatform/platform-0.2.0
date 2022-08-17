import { build } from 'vite';
import { fs, t, Paths } from '../common.mjs';
import { Package } from './Package.mjs';

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

    // Ensure the Vite config file exists.
    await Vite.ensureConfigFileExists(rootDir);

    // Run the builder operation.
    await build({
      root,
      logLevel,
      build: { manifest: true },
    });

    // Update the exports/types on the [package.json] file.
    await Package.update(root, { save: true });
  },

  /**
   * Ensure the [vite.config.ts] file exists within the target module.
   */
  async ensureConfigFileExists(rootDir: t.PathString) {
    rootDir = fs.resolve(rootDir);
    const path = {
      template: fs.join(Paths.templateDir, 'vite.config.ts'),
      instance: fs.join(rootDir, 'vite.config.ts'),
    };
    if (!(await fs.pathExists(path.instance))) {
      await fs.copy(path.template, path.instance);
    }
  },
};
