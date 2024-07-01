/// <reference types="vitest" />

import { type ManualChunksOption } from 'rollup';
import { fileURLToPath } from 'url';
import { BuildOptions, LibraryOptions, UserConfig, UserConfigExport, defineConfig } from 'vite';
import { type InlineConfig as TestConfig } from 'vitest';

import { nodePolyfills } from 'vite-plugin-node-polyfills';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

import { Paths } from './builder';
import { R, Util, asArray, fs, pc, type t } from './builder/common';
import { displayStartupText } from './plugins/displayStartupText';

export { fs };

/**
 * Common configuration setup.
 */
export const Config = {
  fs,

  defaults: {
    /**
     * Test runner.
     */
    test(): TestConfig {
      return {
        globals: false,
        include: ['src/**/*.v.{mts,ts,tsx}'],
        environment: 'happy-dom', // NB: Default, makes DOM available on server/node.
      };
    },
  },

  /**
   * Build configuration generator (with standard defaults).
   */
  vite(modulePath: t.ImportMetaUrl, modify?: t.ModifyViteConfig): UserConfigExport {
    const dir = Wrangle.dirname(modulePath);

    return defineConfig(async (e) => {
      const { command, mode } = e;
      const pkg = await Util.PackageJson.load(dir);
      const name = pkg.name;
      const deps = [
        ...Wrangle.depsList(false, pkg.dependencies),
        ...Wrangle.depsList(true, pkg.devDependencies),
      ];

      const targets: t.ViteTarget[] = [];
      const plugins: t.VitePlugin[] = [];

      /**
       * Vite configuration.
       */
      const external: string[] = [];
      const manualChunks: ManualChunksOption = {};
      const build: BuildOptions = {
        manifest: Paths.viteBuildManifest,
        assetsDir: 'lib',
        target: 'esnext',
        rollupOptions: {
          external,
          output: { manualChunks },
          onwarn(warning, warn) {
            // Use a string match to suppress specific warnings
            // Simply return to ignore the warning
            warn(warning); // ← default warning handler
          },
        },
      };

      const title = pc.gray(`module: ${pc.green(pc.bold(pkg.name))}`);
      const titlePlugin =
        e.command === 'serve' && e.mode !== 'test' ? displayStartupText(title) : undefined;

      let config: UserConfig = {
        build,
        plugins: [topLevelAwait(), wasm(), titlePlugin],
        worker: {
          format: 'es',
          plugins: () => [topLevelAwait(), wasm()],
        },
        optimizeDeps: {
          /**
           * REF: https://automerge.org/docs/quickstart
           * Automerge
           *    This is necessary otherwise `vite dev` includes two separate
           *    versions of the JS wrapper. This causes problems because the JS
           *    wrapper has a module level variable to track JS side heap
           *    allocations, initializing this twice causes horrible breakage
           */
          exclude: [
            '@automerge/automerge-wasm',
            '@automerge/automerge-wasm/bundler/bindgen_bg.wasm',
            '@syntect/wasm',
          ],
        },
        base: './',
        server: { port: 1234 },
      };

      /**
       * TODO 🐷 - Temporary ←[DELETE]
       * Temporary requirement of module: ext.lib.privy
       * https://privy-developers.slack.com/archives/C059ABLSB47/p1692753366943129?thread_ts=1692753043.728049&cid=C059ABLSB47
       */
      const addPolyfill = () => {
        if (mode === 'production') return false;
        return true;
      };

      if (addPolyfill()) {
        const dirname = fs.basename(fs.dirname(modulePath));
        const moduleName = `← ${pc.yellow('vite-plugin-node-polyfills')}`;
        console.log(`${pc.yellow('[TMP]')} polyfills added to ${pc.cyan(dirname)} ${moduleName}`);
        config.plugins?.push(nodePolyfills({ include: ['process', 'buffer', 'util'] }));
      }

      /**
       * Modification IoC
       * (called within each module to perform specific adjustments).
       */
      const args: t.ModifyViteConfigArgs = {
        ctx: R.clone({ name, command, mode, config, pkg, deps }),
        target(...target) {
          R.uniq(target)
            .filter((name) => !targets.includes(name))
            .forEach((name) => targets.push(name));
          return args;
        },
        plugin(...kind) {
          R.uniq(kind)
            .filter((name) => !plugins.includes(name))
            .forEach((name) => plugins.push(name));
          return args;
        },
        externalDependency(moduleName) {
          R.uniq(asArray(moduleName))
            .filter((name) => !external.includes(name))
            .forEach((name) => external.push(name));
          return args;
        },
        chunk(alias, moduleName) {
          manualChunks[alias] = R.uniq(asArray(moduleName ?? alias));
          return args;
        },
        lib(options = {}) {
          const entry = Wrangle.libEntry(options.entry);
          Object.keys(entry).forEach((key) => (entry[key] = fs.join(dir, entry[key])));
          const lib: LibraryOptions = { entry, formats: ['es'] };
          build.lib = lib;
          return args;
        },
        headers(obj) {
          const server = config.server!;
          const headers = server.headers || (server.headers = {});
          server.headers = { ...headers, ...obj };
          return args;
        },
      };

      // Pass execution to the callback.
      await modify?.(args);

      /**
       * Configure plugins.
       */
      const hasPlugin = (...items: t.VitePlugin[]) => items.some((name) => plugins.includes(name));

      if (hasPlugin('web:react')) {
        /**
         * https://million.dev/docs
         * Million.js → This is a provisional test, only keep if there are
         *              no problems and there is an apparent speed advantage.
         */
        const million = (await import('million/compiler')).default;
        const react = (await import('@vitejs/plugin-react-swc')).default;
        const hmr = e.mode === 'development';
        config.plugins?.push(million.vite({ mode: 'react', hmr }));
        config.plugins?.push(react());
      }

      if (hasPlugin('web:svelte')) {
        const svelte = (await import('@sveltejs/vite-plugin-svelte')).svelte;
        config.plugins?.push(svelte());
      }

      if (hasPlugin('rollup:visualizer')) {
        const { visualizer } = await import('rollup-plugin-visualizer');
        config.plugins?.push(
          visualizer({
            title: `${pkg.name} - bundle`,
            filename: 'tmp.bundle-analysis.html',
            open: true,
            gzipSize: true,
          }),
        );
      }

      if (hasPlugin('ssl')) {
        const { devServerSsl } = await import('./plugins/ssl');
        await devServerSsl(config);
      }

      /**
       * Complete
       */
      config = Config.target.apply(config, ...targets);
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

      if (isTarget('web')) test.environment = 'happy-dom';
      if (isTarget('node') && !isTarget('web')) test.environment = 'happy-dom';
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
} as const;

/**
 * Helpers
 */

function getAndAssignTest(config: UserConfig): TestConfig {
  const test = (config as any).test || ((config as any).test = Config.defaults.test());
  return test;
}

const Wrangle = {
  depsList(isDev: boolean, deps: t.PkgDeps = {}): t.PkgDep[] {
    return Object.keys(deps).map((name) => ({ name, version: deps[name], isDev }));
  },

  dirname(modulePath: t.ImportMetaUrl) {
    return fs.dirname(fileURLToPath(modulePath));
  },

  libEntry(entry?: string | t.ViteLibEntry): t.ViteLibEntry {
    if (typeof entry === 'string') return { index: entry };
    if (typeof entry === 'object') return entry;
    return { index: '/src/index.ts' };
  },
};
