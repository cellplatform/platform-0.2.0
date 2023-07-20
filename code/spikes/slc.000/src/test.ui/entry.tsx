import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';

console.info(`Pkg:`, Pkg);
const url = new URL(window.location.href);
const isDev = url.searchParams.has('dev');
const root = createRoot(document.getElementById('root')!);

(async () => {
  if (isDev) {
    const { Dev } = await import('sys.ui.react.common');
    const { Specs } = await import('./entry.Specs.mjs');
    const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
    root.render(<StrictMode>{el}</StrictMode>);
  } else {
    const { Root } = await import('../ui/Root.IFrame');
    const el = <Root />;
    root.render(<StrictMode>{el}</StrictMode>);
  }
})();
