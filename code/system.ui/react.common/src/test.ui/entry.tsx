import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';
import Specs from './entry.Specs.mjs';

(async () => {
  const root = createRoot(document.getElementById('root')!);
  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  root.render(<StrictMode>{el}</StrictMode>);
})();
