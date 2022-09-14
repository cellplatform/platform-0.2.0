/// <reference types="vitest" />

import { defineConfig, LibraryOptions, UserConfig, BuildOptions } from 'vite';
import { fs } from './common/index.mjs';
import type { RollupOptions } from 'rollup';
import { Paths } from './Paths.mjs';

export type PackageJson = {
  name: string;
  version: string;
  types: string;
  type: 'module';
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

type ModifyViteConfig = (args: ModifyViteConfigArgs) => Promise<unknown> | unknown;
type ModifyViteConfigArgs = {
  readonly ctx: ModifyViteConfigCtx;
  addExternalDependency(moduleName: string | string[]): void;
  platform(target: 'web' | 'node'): void;
};
type ModifyViteConfigCtx = {
  readonly name: string;
  readonly command: 'build' | 'serve';
  readonly mode: string;
  readonly pkg: PackageJson;
  readonly deps: { [key: string]: string }; // All dependencies (incl. "dev")
  readonly config: UserConfig;
};

/**
 * Common configuration defaults.
 */
export const ViteConfig = {
  defaults: {
    /**
     * Test runner.
     */
    test() {
      return {
        globals: false,
        include: ['**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}'],
        environment: 'jsdom',
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
  default(dir: string, modify?: ModifyViteConfig) {
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

      const config: UserConfig = {
        plugins: [],
        test: ViteConfig.defaults.test(),
        build,
        worker: { format: 'es' },
      };

      /**
       * Modification IoC (called within each module to perform specific adjustments).
       */
      const args: ModifyViteConfigArgs = {
        ctx: { name, command, mode, config, pkg, deps },
        addExternalDependency(moduleName) {
          asArray(moduleName)
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
        },
        platform(target) {
          if (target === 'web') build.ssr = undefined;
          if (target === 'node') build.ssr = true;
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
