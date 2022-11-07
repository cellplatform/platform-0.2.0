import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');
  e.chunk('sys.fs', ['sys.fs', 'sys.fs.indexeddb']);
  e.chunk('sys.text');
  e.chunk('sys.util.css');
});
