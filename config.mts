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
      include: ['**/*.{TEST}.{ts,tsx,mts,mtsx}'],
    },

    /**
     * Builder options.
     */
    lib(dir: string, name: string): LibraryOptions {
      return {
        name: name,
        entry: `${dir}/src/main`,
        fileName: 'main',
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
        test: ViteConfig.defaults.test,
        build: {
          lib: ViteConfig.defaults.lib(dir, name),
          rollupOptions: { output: { globals: {} } },
        },
      };
    });
  },
};
