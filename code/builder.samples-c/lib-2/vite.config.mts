/// <reference types="vitest" />

import { defineConfig, LibraryOptions } from "vite";
export { defineConfig };
import pkg from "./package.json";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.{TEST,SPEC}.{ts,tsx,mts,mtsx}"],
  },
  build: {
    lib: {
      name: pkg.name,
      entry: `${__dirname}/src/index`,
      fileName: "main",
      formats: ["es"],
    },
  },
});
