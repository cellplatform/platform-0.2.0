import { Config } from '../../../Config';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.externalDependency(e.ctx.deps.filter((d) => d.name.startsWith('sys.')).map((d) => d.name));
  e.target('web', 'node');
});
