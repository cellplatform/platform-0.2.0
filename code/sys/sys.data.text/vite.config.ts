import { Config } from '../../../config';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  // e.externalDependency(e.ctx.deps.filter((d) => d.name.startsWith('sys.')).map((d) => d.name));
  e.target('web', 'node');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
