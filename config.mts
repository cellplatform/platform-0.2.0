/// <reference types="vitest" />
import { defineConfig, LibraryOptions, UserConfig } from 'vite';

import fs from 'fs-extra';
import { join } from 'path';
import type { RollupOptions } from 'rollup';
export { defineConfig };

export type PackageJson = {
  name: string;
  version: string;
  types: string;
  type: 'module';
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

type ModifyConfig = (args: ModifyConfigArgs) => Promise<unknown>;
type ModifyConfigArgs = {
  readonly ctx: ModifyConfigCtx;
  addExternalDependency(moduleName: string | string[]): void;
};
type ModifyConfigCtx = {
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
        globals: true,
        include: ['**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}'],
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
  default(dir: string, modify?: ModifyConfig) {
    return defineConfig(async ({ command, mode }) => {
      const pkg = (await fs.readJson(join(dir, 'package.json'))) as PackageJson;
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

      const config: UserConfig = {
        plugins: [],
        test: ViteConfig.defaults.test(),
        build: { lib, rollupOptions },
      };

      /**
       * Modification IoC (called within each module to perform specific adjustments).
       */
      const args: ModifyConfigArgs = {
        ctx: { name, command, mode, config, pkg, deps },
        addExternalDependency(moduleName) {
          asArray(moduleName)
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
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
