import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  // e.chunk('ext.react', ['react', 'react-dom']);

  // e.lib({ entry: { index: 'src/index.mts' } });
  // e.target('web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
