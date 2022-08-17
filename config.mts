/// <reference types="vitest" />

import { defineConfig, LibraryOptions } from 'vite';
export { defineConfig };

export const ViteConfig = {
  default: {
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
