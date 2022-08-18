import colors from 'picocolors';
import fsextra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import * as t from './types.mjs';

export { t, colors };
export const fs = { ...fsextra, ...path };

/**
 * Paths
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../..');
const tmplDir = fs.join(__dirname, 'template');

export const Paths = {
  rootDir,
  buildManifest: 'dist/manifest.json',
  tmpl: {
    dir: tmplDir,
    esmConfig: 'esm.json',
    viteConfig: 'vite.config.mts',
    indexHtml: 'index.html',
    src: ['src/index.mts', 'src/index.TEST.mts'],
    tsconfig: {
      code: 'tsconfig.code.json',
      types: 'tsconfig.types.json',
    },
  },
};
