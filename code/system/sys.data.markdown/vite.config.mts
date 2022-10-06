import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.externalDependency(e.ctx.deps.filter((d) => d.name.startsWith('sys.')).map((d) => d.name));

  /**
   * TODO 🐷
   * - Build for both environments
   * - Folders:
   *      /dist/web
   *      /dist/node
   *
   * - Exports:
   *      import { Markdown } from 'sys.data.markdown/web`
   *      import { Markdown } from 'sys.data.markdown/node`
   */

  e.target('web', 'node');
});
