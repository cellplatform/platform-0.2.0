import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: '/src/index.mts',
    },
  });

  e.target('node');
  // e.externalDependency(e.ctx.deps.map((d) => d.name));
});
