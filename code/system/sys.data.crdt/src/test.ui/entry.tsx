import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from 'sys.ui.react.common';
import { Pkg } from '../index.pkg.mjs';

(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs.mjs');

  const el = await Dev.render(Pkg, Specs, { hrDepth: 4 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
