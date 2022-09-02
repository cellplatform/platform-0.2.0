import { fileURLToPath } from 'url';
import { fs } from './common/fs.mjs';

/**
 * Paths.
 */
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../../..');

export const Paths = {
  rootDir,
  buildManifest: 'dist/manifest.json',
  tmpl: {
    dir: fs.join(__dirname, '../template.esm'),
    esmConfig: 'esm.json',
    viteConfig: 'vite.config.mts',
    indexHtml: 'index.html',
    src: [
      'src/index.mts',
      'src/index.TEST.mts',
      'src/types.mts',
      'src/TEST/index.mts',
      'src/common/index.mts',
      'src/common/libs.mts',
      'src/common/types.mts',
    ],
    tsconfig: {
      code: 'tsconfig.code.json',
      types: 'tsconfig.types.json',
    },
  },
};
