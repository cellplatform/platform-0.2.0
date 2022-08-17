/// <reference types="vitest" />

import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  plugins: [],

  build: {
    lib: {
      name: pkg.name,
      entry: `${__dirname}/src/main`,
      fileName: 'main',
      formats: ['es'],
    },

    rollupOptions: {
      output: { globals: {} },
    },
  },

  test: {
    globals: true,
    include: ['**/*.{TEST,SPEC}.{ts,tsx}'],
  },
});
