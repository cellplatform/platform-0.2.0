import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('lib.react', 'react');
  e.chunk('lib.react.dom', 'react-dom');
  e.chunk('lib.framer-motion', 'framer-motion');
  e.chunk('lib.ua-parser', 'ua-parser-js');

  e.chunk('lib.privy', '@privy-io/react-auth');
  e.chunk('lib.automerge', '@automerge/automerge');
  e.chunk('lib.automerge.wasm', '@automerge/automerge-wasm');
  e.chunk('ext.lib.automerge');
  e.chunk('ext.lib.automerge.webrtc');

  e.chunk('sys.util', 'sys.util');
  e.chunk('sys.text', 'sys.text');
  e.chunk('sys.css', 'sys.ui.react.css');
  e.chunk('sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);

  e.plugin('rollup:visualizer');
});
