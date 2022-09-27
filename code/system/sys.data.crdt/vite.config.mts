import { ViteConfig } from '../../../config.mjs';
export default ViteConfig.default(import.meta.url, (e) => {
  e.lib();
  e.addExternalDependency(e.ctx.deps.map((d) => d.name));
});
