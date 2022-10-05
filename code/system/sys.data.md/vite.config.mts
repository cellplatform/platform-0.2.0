import { Config } from '../../../config.mjs';

export default Config.vite(import.meta.url, (e) => {
  e.lib();
  e.addExternalDependency(e.ctx.deps.filter((d) => d.name.startsWith('sys.')).map((d) => d.name));

  /**
   * TODO 🐷
   * - Build for both environments
   * - Folders:
   *      /dist/web
   *      /dist/node
   *
   * - Exports:
   *      import { Markdown } from 'sys.data.md/web`
   *      import { Markdown } from 'sys.data.md/node`
   */
  // e.env('web');
  e.env('node');
});

export const tsconfig = Config.ts((e) => e.env('web', 'web:react'));
