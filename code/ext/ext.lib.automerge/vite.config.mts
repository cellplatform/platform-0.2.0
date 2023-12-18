import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: 'src/index.mts',
      specs: 'src/test.ui/entry.Specs.mts',
    },
  });
  e.target('web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
  e.chunk('ui.specs', ['src/ui/ui.Info/-SPEC.tsx', 'src/ui/ui.RepoList/-SPEC.tsx']);
});
