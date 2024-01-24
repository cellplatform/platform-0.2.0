import { Config } from '../../../config';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.target('node', 'web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
