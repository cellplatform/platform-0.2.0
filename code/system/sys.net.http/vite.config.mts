import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.env('web');
  e.addExternalDependency(e.ctx.deps.map((d) => d.name));
});

export const tsconfig = Config.ts((e) => e.env('web'));
