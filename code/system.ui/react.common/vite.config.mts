import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: '/src/index.mts',
      dev: '/src/ui.dev/index.ts',
      specs: '/src/test.ui/entry.Specs.mts',
    },
  });
  e.target('web');
  e.plugin('web:react');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
