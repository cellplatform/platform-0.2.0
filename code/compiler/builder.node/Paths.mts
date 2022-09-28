import { fileURLToPath } from 'url';
import { fs } from './common/fs.mjs';

/**
 * Paths.
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../../..');

export const Paths = {
  rootDir,
  dist: 'dist',
  viteManifest: 'dist/.build.manifest.json',
  types: {
    dirname: 'types.d',
    dist: 'dist/types.d',
  },
  tsc: {
    tmpBuilder: '.builder',
    rootTsConfig: fs.join(rootDir, 'tsconfig.json'),
  },
  tmpl: {
    dir: fs.join(__dirname, '../template.esm'),
    viteConfig: 'vite.config.mts',
    indexHtml: 'index.html',
    pkg: 'src/index.pkg.mts',
    src: [
      'src/index.mts',
      'src/index.pkg.mts',
      'src/index.TEST.mts',
      'src/types.mts',
      'src/Test/index.mts',
      'src/common/index.mts',
      'src/common/libs.mts',
      'src/common/types.mts',
    ],
    tsConfig: {
      code: 'tsconfig.code.json',
      types: 'tsconfig.types.json',
    },
  },
};
