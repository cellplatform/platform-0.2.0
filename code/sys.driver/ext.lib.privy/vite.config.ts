import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => e.env('web', 'web:react'));

export default Config.vite(import.meta.url, (e) => {
  e.lib({ entry: { index: 'src/index.ts' } });
  e.target('web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
