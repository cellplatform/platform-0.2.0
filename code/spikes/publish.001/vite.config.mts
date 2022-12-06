import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('external', ['ramda']);
  e.chunk('external.rx', ['rxjs', 'symbol-observable']);
  e.chunk('external.react', ['react', 'react-dom']);

  e.chunk('sys.text', 'sys.text');
  e.chunk('sys.util', 'sys.util');
  e.chunk('sys.util.css', 'sys.util.css');
  e.chunk('sys.data.json', 'sys.data.json');
  e.chunk('sys.fs', ['sys.fs', 'sys.fs.indexeddb']);
  e.chunk('sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);
  e.chunk('sys.video', 'sys.ui.react.video');
  e.chunk('sys.monaco', 'sys.ui.react.monaco');
});
