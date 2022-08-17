/// <reference types="vitest" />

import { defineConfig, LibraryOptions } from 'vite';
export { defineConfig };

export const ViteConfig = {
  /**
   * Configuration defaults.
   */
  default: {
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
    library(dir: string, packageName: string): LibraryOptions {
      return {
        name: packageName,
        entry: `${dir}/src/main`,
        fileName: 'main',
        formats: ['es'],
      };
    },
  },
};
