/// <reference types="vitest" />
import { BuildOptions, defineConfig, LibraryOptions, UserConfigExport } from 'vite';

import { R, fs, t, asArray, Util } from './common/index.mjs';
import { Paths } from './Paths.mjs';
import react from '@vitejs/plugin-react';

import type { RollupOptions } from 'rollup';

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
  },

  /**
   * Build configuration generator (with standard defaults).
   */
  default(dir: string, modify?: t.ModifyViteConfig) {
    return defineConfig(async ({ command, mode }) => {
      const pkg = await Util.PackageJson.load(dir);
      const name = pkg.name;
      const deps = [
        ...toDepsList(false, pkg.dependencies),
        ...toDepsList(true, pkg.devDependencies),
      ];

      /**
       * Vite configuration.
       */
      const external: string[] = [];
      const rollupOptions: RollupOptions = { external };
      const build: BuildOptions = {
        rollupOptions,
        manifest: fs.basename(Paths.viteManifest),
      };

      const config: UserConfigExport = {
        plugins: [],
        build,
        worker: { format: 'es' },
      };

      const test = ViteConfig.defaults.test();
      (config as any).test = test;

      /**
       * Modification IoC (called within each module to perform specific adjustments).
       */
      const args: t.ModifyViteConfigArgs = {
        ctx: R.clone({ name, command, mode, config, pkg, deps }),
        addExternalDependency(moduleName) {
          R.uniq(asArray(moduleName))
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
        },
        environment(target) {
          const env = R.uniq(asArray(target));
          if (env.includes('web')) test.environment = 'jsdom';
          if (env.includes('node') && !env.includes('web')) test.environment = 'node';
          if (env.includes('node')) build.ssr = true;
          if (env.includes('web:react')) config.plugins?.push(react());
        },
        lib(options = {}) {
          const { name = pkg.name, outname = 'index', entry = '/src/index.mts' } = options;
          const lib: LibraryOptions = {
            name,
            entry: fs.join(dir, entry),
            fileName: outname,
            formats: ['es'],
          };
          build.lib = lib;
        },
      };

      await modify?.(args);
      return config;
    });
  },
};

/**
 * Helpers
 */
const toDepsList = (isDev: boolean, deps: t.PkgDeps = {}): t.PkgDep[] => {
  return Object.keys(deps).map((name) => ({ name, version: deps[name], isDev }));
};
