import { Config } from '../../../Config';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.target('node');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
