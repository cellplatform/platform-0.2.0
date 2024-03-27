import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('ext', ['ramda']);
  e.chunk('ext.rx', ['rxjs', 'symbol-observable']);
  e.chunk('ext.react', ['react', 'react-dom']);

  e.chunk('sys.text', 'sys.text');
  e.chunk('sys.util', ['sys.util', 'sys.ui.dom']);
  e.chunk('sys.css', 'sys.ui.react.css');
  e.chunk('sys.json', 'sys.data.json');
  e.chunk('sys.fs', ['sys.fs', 'sys.fs.indexeddb']);
  e.chunk('sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);
  e.chunk('sys.media', 'sys.ui.react.media');
  e.chunk('sys.monaco', 'sys.ui.react.monaco');
});
