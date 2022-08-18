import fsextra from 'fs-extra';
import glob from 'glob';
import path from 'path';
import colors from 'picocolors';
import { fileURLToPath } from 'url';

import * as t from './types.mjs';

export { t, colors };

/**
 * Filesystem.
 */
export const fs = {
  ...fsextra,
  ...path,
  glob: {
    find(pattern: string) {
      return new Promise<string[]>((resolve, reject) => {
        glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)));
      });
    },
  },
};

/**
 * Paths.
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
