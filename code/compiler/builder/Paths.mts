import { fileURLToPath } from 'url';
import { fs, type t } from './common/index.mjs';

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
      'script.ts/tmp.mts',
      'src/global.d.ts',

      'src/index.mts',
      'src/index.pkg.mts',

      'src/types.ts',
      'src/global.d.ts',

      'src/common/index.ts',
      'src/common/libs.ts',
      'src/common/types.ts',

      'src/test/-TEST.v.ts',
      'src/test/index.ts',

      'src/test.ui/-TEST.ts',
      'src/test.ui/-TestRunner.TESTS.ts',
      'src/test.ui/-TestRunner.tsx',
      'src/test.ui/common.ts',
      'src/test.ui/entry.Specs.mts',
      'src/test.ui/entry.tsx',
      'src/test.ui/index.ts',

      'src/ui/common/index.ts',
      'src/ui/common/libs.ts',
      'src/ui/common/types.ts',

      'src/ui/ui.Info/-SPEC.tsx',
      'src/ui/ui.Info/field.Module.Verify.tsx',
      'src/ui/ui.Info/common.ts',
      'src/ui/ui.Info/index.ts',
      'src/ui/ui.Info/Root.tsx',
      'src/ui/ui.Info/types.ts',
      'src/ui/ui.Sample/-SPEC.tsx',
      'src/ui/Icons.ts',
    ],
  },
};
