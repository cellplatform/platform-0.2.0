/// <reference types="vitest" />
import { BuildOptions, defineConfig, LibraryOptions, UserConfig } from 'vite';

import { fs, t } from './common/index.mjs';
import { Paths } from './Paths.mjs';

import type { RollupOptions } from 'rollup';
export type PackageJson = {
  name: string;
  version: string;
  types: string;
  type: 'module';
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

import type { InlineConfig as TestConfig } from 'vitest';

/**
 * Common configuration defaults.
 */
export const ViteConfig = {
  defaults: {
    /**
     * Test runner.
     */
    test(): TestConfig {
      return {
        globals: false,
        include: ['**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}'],
        environment: 'node',
      };
    },

    /**
     * Builder options.
     */
    lib(dir: string, name: string): LibraryOptions {
      return {
        name,
        entry: `${dir}/src/index.mts`,
        fileName: 'index',
        formats: ['es'],
      };
    },
  },

  /**
   * Build configuration generator (with standard defaults).
   */
  default(dir: string, modify?: t.ModifyViteConfig) {
    return defineConfig(async ({ command, mode }) => {
      const pkg = (await fs.readJson(fs.join(dir, 'package.json'))) as PackageJson;
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const name = pkg.name;
      const lib = ViteConfig.defaults.lib(dir, name);

      /**
       * Vite configuration.
       */
      const external: string[] = [];
      const rollupOptions: RollupOptions = {
        external,
        output: { globals: {} },
      };

      const build: BuildOptions = {
        lib,
        rollupOptions,
        manifest: fs.basename(Paths.viteManifest),
      };

      const test = ViteConfig.defaults.test();

      const config: UserConfig = {
        plugins: [],
        test,
        build,
        worker: { format: 'es' },
      };

      /**
       * Modification IoC (called within each module to perform specific adjustments).
       */
      const args: t.ModifyViteConfigArgs = {
        ctx: { name, command, mode, config, pkg, deps },
        addExternalDependency(moduleName) {
          asArray(moduleName)
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
        },
        environment(target) {
          if (target === 'web') {
            build.ssr = undefined;
            test.environment = 'jsdom';
          }
          if (target === 'node') {
            build.ssr = true;
            test.environment = 'node';
          }
        },
      };

      Object.keys(deps).forEach((moduleName) => args.addExternalDependency(moduleName));
      await modify?.(args);
      return config;
    });
  },
};

/**
 * [Helpers]
 */

function asArray<T>(input: T | T[]) {
  return (Array.isArray(input) ? input : [input]).filter(Boolean);
}
