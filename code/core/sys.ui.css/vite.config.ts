import { defineConfig, ViteConfig } from '../../../config/Vite.mjs';
import pkg from './package.json';

export default defineConfig(async ({ command, mode }) => {
  return {
    plugins: [],
    build: {
      lib: ViteConfig.default.library(__dirname, pkg.name),
      rollupOptions: { output: { globals: {} } },
    },
    test: ViteConfig.default.test,
  };
});
