import { fileURLToPath } from 'url';
import { t, fs } from './common/index.mjs';

/**
 * Paths.
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../../..');
const tmplDir = fs.join(__dirname, '../template.esm');
const tsconfigDir = fs.join(__dirname, '../tsconfig');

export const Paths = {
  rootDir,
  viteBuildManifest: '.build.manifest.json',

  outDir: {
    root: 'dist',
    web: 'dist/web',
    node: 'dist/node',
    target(target: t.ViteTarget) {
      if (target === 'web') return Paths.outDir.web;
      if (target === 'node') return Paths.outDir.node;
      throw new Error(`Target "${target}" not supported`);
    },
  },

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
    config: 'vite.config.mts',
    indexHtml: 'index.html',
    pkg: 'src/index.pkg.mts',
    src: [
      'src/global.d.ts',
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
