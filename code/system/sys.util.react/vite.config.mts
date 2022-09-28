import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.env('web', 'web:react');
  e.addExternalDependency(e.ctx.deps.filter((d) => d.name !== 'react').map((d) => d.name));
});

export const tsconfig = Config.ts((e) => e.env('web', 'web:react'));
