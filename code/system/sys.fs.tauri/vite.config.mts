import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.target('web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
