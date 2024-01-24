import { Config } from '../../../Config';

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
});
