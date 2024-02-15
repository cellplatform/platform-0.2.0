import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('ext.react', 'react');
  e.chunk('ext.react.dom', 'react-dom');
  e.chunk('ext.framer-motion', 'framer-motion');

  e.chunk('ext.lib.privy', '@privy-io/react-auth');
  // e.chunk('ext.eth.wagmi', 'wagmi');
  // e.chunk('ext.eth.viem', 'viem');

  e.chunk('sys.util', 'sys.util');
  e.chunk('sys.text', 'sys.text');
  e.chunk('sys.css', 'sys.ui.react.css');
  e.chunk('sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);
});
