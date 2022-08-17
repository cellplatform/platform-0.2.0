import * as t from './types.mjs';
import fsextra from 'fs-extra';
import path from 'path';

export { t };
export const fs = { ...fsextra, ...path };

/**
 * Paths
 */
import { fileURLToPath } from 'url';
const __dirname = fs.dirname(fileURLToPath(import.meta.url));

export const Paths = {
  __dirname,
  rootDir: fs.join(__dirname, '../..'),
  buildManifest: 'dist/manifest.json',
  tmpl: {
    dir: fs.join(__dirname, 'tmpl'),
    esmConfig: 'esm.json',
    tsconfig: {
      code: 'tsconfig.code.json',
      types: 'tsconfig.types.json',
    },
  },
};
