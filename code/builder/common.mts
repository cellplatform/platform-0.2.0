import fsextra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import * as t from './types.mjs';

export { t };
export const fs = { ...fsextra, ...path };

/**
 * Paths
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../..');

export const Paths = {
  rootDir,
  buildManifest: 'dist/manifest.json',
  tmpl: {
    dir: fs.join(__dirname, 'template'),
    esmConfig: 'esm.json',
    tsconfig: {
      code: 'tsconfig.code.json',
      types: 'tsconfig.types.json',
    },
  },
};
