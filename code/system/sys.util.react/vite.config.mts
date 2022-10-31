import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.target('web');
  e.plugin('web:react');
  e.externalDependency(e.ctx.deps.filter((d) => d.name !== 'react').map((d) => d.name));
});
