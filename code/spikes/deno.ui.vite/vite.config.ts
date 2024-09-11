import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => e.env('web', 'web:react'));

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('lib.ext.react', 'react');
  e.chunk('lib.ext.react.dom', 'react-dom');
  e.chunk('lib.ext.ua-parser', 'ua-parser-js');

  // e.lib({ entry: { index: 'src/index.ts' } });
  // e.target('web');
  // e.externalDependency(e.ctx.deps.map((d) => d.name));

  // e.plugin('rollup:visualizer');
});
