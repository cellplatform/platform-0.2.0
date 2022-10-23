/// <reference types="vitest" />
import { fileURLToPath } from 'url';
import { BuildOptions, defineConfig, UserConfigExport, UserConfig, LibraryOptions } from 'vite';

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
        include: ['**/*.{TEST,SPEC}.{mts,tsx}'],
        environment: 'node',
      };
    },
  },

  /**
   * Build configuration generator (with standard defaults).
   */
  vite(modulePath: t.ImportMetaUrl, modify?: t.ModifyViteConfig): UserConfigExport {
    const dir = toDirname(modulePath);

    return defineConfig(async (e) => {
      const { command, mode } = e;
      const pkg = await Util.PackageJson.load(dir);
      const name = pkg.name;
      const deps = [
        ...toDepsList(false, pkg.dependencies),
        ...toDepsList(true, pkg.devDependencies),
      ];

      const targets: t.ViteTarget[] = [];
      const plugins: t.VitePlugin[] = [];

      /**
       * Vite configuration.
       */
      const external: string[] = [];
      const rollupOptions: RollupOptions = { external };
      const build: BuildOptions = {
        rollupOptions,
        manifest: Paths.viteBuildManifest,
        assetsDir: 'lib',
      };

      let config: UserConfig = {
        build,
        plugins: [],
        worker: { format: 'es' },
      };

      /**
       * Modification IoC (called within each module to perform specific adjustments).
       */
      const args: t.ModifyViteConfigArgs = {
        ctx: R.clone({ name, command, mode, config, pkg, deps }),
        target(...target) {
          R.uniq(target)
            .filter((name) => !targets.includes(name))
            .forEach((name) => targets.push(name));
        },
        plugin(...kind) {
          R.uniq(kind)
            .filter((name) => !plugins.includes(name))
            .forEach((name) => plugins.push(name));
        },
        externalDependency(moduleName) {
          R.uniq(asArray(moduleName))
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
        },
        lib(options = {}) {
          const { outname: fileName = 'index' } = options;
          const entry = fs.join(dir, options.entry ?? '/src/index.mts');
          const lib: LibraryOptions = {
            entry,
            fileName,
            formats: ['es'],
          };
          build.lib = lib;
        },
      };

      // Pass execution to the callback.
      await modify?.(args);

      /**
       * Configure plugins.
       */
      const hasPlugin = (...items: t.VitePlugin[]) => items.some((name) => plugins.includes(name));

      if (hasPlugin('web:react')) {
        const react = (await import('@vitejs/plugin-react')).default;
        config.plugins?.push(react());
      }

      if (hasPlugin('web:svelte')) {
        const svelte = (await import('@sveltejs/vite-plugin-svelte')).svelte;
        config.plugins?.push(svelte());
      }

      /**
       * Configure for target environment.
       */
      config = Config.target.apply(config, ...targets);

      // Finish up.
      return config;
    });
  },

  /**
   * Helpers for adjusting a configuration based on the build targets.
   */
  target: {
    get(config: UserConfig): t.ViteTarget[] {
      return (config as any).__targets ?? [];
    },

    apply(config: UserConfig, ...targets: t.ViteTarget[]) {
      config = R.clone(config);
      const test = getAndAssignTest(config);

      const DEFAULT: t.ViteTarget = 'web';
      const isTarget = (...items: t.ViteTarget[]) => {
        if (targets.length === 0 && items.includes(DEFAULT)) return true; // NB: Default "web" target if nothing specified.
        return items.some((name) => targets.includes(name));
      };

      if (isTarget('web')) test.environment = 'jsdom';
      if (isTarget('node') && !isTarget('web')) test.environment = 'node';
      if (isTarget('node')) config.build!.ssr = true;

      (config as any).__targets = targets;
      return config;
    },

    reset(config: UserConfig) {
      config = R.clone(config);
      const test = getAndAssignTest(config);

      test.environment = undefined;
      config.build!.ssr = undefined;
      delete (config as any).__targets;

      return config;
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
          const is = (...items: t.TsEnv[]) => items.some((name) => env.includes(name));

          if (is('web')) {
            api.edit((tsconfig) => ensureLibs(tsconfig, 'DOM', 'DOM.Iterable', 'WebWorker'));
          }

          if (is('web:react')) {
            api.edit((tsconfig) => (tsconfig.compilerOptions.jsx = 'react-jsx'));
          }

          if (is('web:svelte')) {
            api.edit((tsconfig) => (tsconfig.extends = '@tsconfig/svelte/tsconfig.json'));
          }
        },
      };

      modify(api);
      return _current;
    };
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

function getAndAssignTest(config: UserConfig): TestConfig {
  const test = (config as any).test || ((config as any).test = Config.defaults.test());
  return test;
}
