/// <reference types="vitest" />

import { defineConfig, LibraryOptions } from 'vite';
export { defineConfig };

export const ViteConfig = {
  defaults: {
    /**
     * Test runner.
     */
    test: {
      globals: true,
      include: ['**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}'],
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
   * Default configuration
   */
  default(dir: string, name: string) {
    return defineConfig(async ({ command, mode }) => {
      return {
        plugins: [],
        test: {
          ...ViteConfig.defaults.test,
        },
        build: {
          lib: ViteConfig.defaults.lib(dir, name),
          rollupOptions: { output: { globals: {} } },
        },
      };
    });
  },
};
