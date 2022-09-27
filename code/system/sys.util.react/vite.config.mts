import { Config } from '../../../config.mjs';
export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.environment(['web', 'web:react']);
  e.addExternalDependency(e.ctx.deps.filter((d) => d.name !== 'react').map((d) => d.name));
});
