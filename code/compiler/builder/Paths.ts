import { fileURLToPath } from 'url';
import { fs, type t } from './common';
import { paths as tmpl } from '../../-tmpl/esm/-PATHS';

/**
 * Paths.
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../../..');
const tsconfigDir = fs.join(__dirname, '../tsconfig');

export const Paths = {
  rootDir,
  viteBuildManifest: '.build.manifest.json',
  certDir: fs.join(rootDir, '.dev/.certs'),

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
    ...tmpl,
    dir: fs.join(__dirname, '../../-tmpl/esm'),
  },
} as const;
