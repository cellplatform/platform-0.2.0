/// <reference types="vitest" />
import { fileURLToPath } from 'url';
import { BuildOptions, defineConfig, UserConfigExport } from 'vite';

import { asArray, fs, R, t, Util } from './common/index.mjs';
import { Paths } from './Paths.mjs';

import type { RollupOptions } from 'rollup';
import type { InlineConfig as TestConfig } from 'vitest';

/**
 * Common configuration setup.
 */
export const Config = {
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
   * Typescript configuration modifier (tsconfig.json).
   */
  ts(modify: t.ModifyTsConfig): t.TsConfigExport {
    return async (args) => {
      const { kind } = args;

      let _current = R.clone(args.config);

      const ensureLibs = (input: t.TsConfig, ...items: string[]) => {
        let next = input;
        let lib = next.compilerOptions.lib || (next.compilerOptions.lib = []);
        next.compilerOptions.lib = R.uniq([...lib, ...items]);
        return next;
      };

      const api: t.ModifyTsConfigArgs = {
        kind,

        get current() {
          return { ..._current };
        },

        edit(fn) {
          const next = api.current; // retrieve the clone to mutate.
          fn(next);
          _current = next;
        },

        /**
         * Named environment(s).
         */
        env(...target) {
          const env = R.uniq(target);
          const is = (...items: t.BuilderEnv[]) => items.some((name) => env.includes(name));

          if (is('web')) {
            api.edit((tsconfig) => ensureLibs(tsconfig, 'DOM', 'DOM.Iterable', 'WebWorker'));
          }

          if (is('web:react')) {
            api.edit((tsconfig) => (tsconfig.compilerOptions.jsx = 'react-jsx'));
          }
        },
      };

      modify(api);
      return _current;
    };
  },

  /**
   * Build configuration generator (with standard defaults).
   */
  vite(modulePath: t.ImportMetaUrl, modify?: t.ModifyViteConfig): UserConfigExport {
    const dir = toDirname(modulePath);

    return defineConfig(async ({ command, mode }) => {
      const pkg = await Util.PackageJson.load(dir);
      const name = pkg.name;
      const env: t.BuilderEnv[] = [];
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

      const test = Config.defaults.test();
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
        env(...target) {
          R.uniq(target)
            .filter((name) => !env.includes(name))
            .forEach((name) => env.push(name));
        },
        lib(options = {}) {
          const { name = pkg.name, outname: fileName = 'index' } = options;
          const entry = fs.join(dir, options.entry ?? '/src/index.mts');
          build.lib = {
            name,
            entry,
            fileName,
            formats: ['es'],
          };
        },
      };

      // Pass execution to the callback.
      await modify?.(args);

      // Update configuration based on passed environment settings.
      const is = (...items: t.BuilderEnv[]) => items.some((name) => env.includes(name));
      if (is('web')) test.environment = 'jsdom';
      if (is('node') && !is('web')) test.environment = 'node';
      if (is('node')) build.ssr = true;
      if (is('web:react')) {
        const react = (await import('@vitejs/plugin-react')).default;
        config.plugins?.push(react());
      }

      // Finish up.
      return config;
    });
  },
};

/**
 * Helpers
 */

function toDepsList(isDev: boolean, deps: t.PkgDeps = {}): t.PkgDep[] {
  return Object.keys(deps).map((name) => ({ name, version: deps[name], isDev }));
}

function toDirname(modulePath: t.ImportMetaUrl) {
  return fs.dirname(fileURLToPath(modulePath));
}
