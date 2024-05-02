import { Config } from '../../../config';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  e.chunk('lib.ext.react', 'react');
  e.chunk('lib.ext.react.dom', 'react-dom');
  e.chunk('lib.ext.framer-motion', 'framer-motion');
  e.chunk('lib.ext.ua-parser', 'ua-parser-js');
  e.chunk('lib.ext.privy', ['ext.lib.privy', '@privy-io/react-auth']);

  e.plugin('rollup:visualizer');
});
