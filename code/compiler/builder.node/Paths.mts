import { fileURLToPath } from 'url';
import { fs } from './common/fs.mjs';

/**
 * Paths.
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../../..');
const tmplDir = fs.join(__dirname, '../template.esm');
const tsconfigDir = fs.join(__dirname, '../tsconfig');

export const Paths = {
  rootDir,
  dist: 'dist',
  viteManifest: 'dist/.build.manifest.json',
  types: {
    dirname: 'types.d',
    dist: 'dist/types.d',
  },
  tmpBuilderDir: '.builder',
  tsConfig: {
    base: fs.join(tsconfigDir, 'tsconfig.json'),
    code: fs.join(tsconfigDir, 'tsconfig.code.json'),
    types: fs.join(tsconfigDir, 'tsconfig.types.json'),
  },
  tmpl: {
    dir: tmplDir,
    viteConfig: 'vite.config.mts',
    indexHtml: 'index.html',
    pkg: 'src/index.pkg.mts',
    src: [
      'src/declare.d.ts',
      'src/index.mts',
      'src/index.pkg.mts',
      'src/index.TEST.mts',
      'src/types.mts',
      'src/test/index.mts',
      'src/common/index.mts',
      'src/common/libs.mts',
      'src/common/types.mts',
    ],
  },
};
