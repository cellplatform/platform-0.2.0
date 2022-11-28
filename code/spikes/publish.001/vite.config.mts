import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('external', ['@monaco-editor/react', 'monaco-editor', 'ramda']);
  e.chunk('external.rx', ['rxjs', 'symbol-observable']);
  e.chunk('external.react', ['react', 'react-dom']);

  e.chunk('runtime.sys.text', 'sys.text');
  e.chunk('runtime.sys.util', 'sys.util');
  e.chunk('runtime.sys.util.css', 'sys.util.css');
  e.chunk('runtime.sys.data.json', 'sys.data.json');
  e.chunk('runtime.sys.fs', ['sys.fs', 'sys.fs.indexeddb']);
  e.chunk('runtime.sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);
  e.chunk('runtime.sys.video', 'sys.ui.react.video');
});
