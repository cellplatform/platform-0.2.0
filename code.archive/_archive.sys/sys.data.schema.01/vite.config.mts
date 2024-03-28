import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react'); // NB: React used for TestHarness.
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
