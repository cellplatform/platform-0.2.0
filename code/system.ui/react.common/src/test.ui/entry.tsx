import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';
import { Specs, DevSpecs, ExternalSpecs } from './entry.Specs.mjs';

(async () => {
  const root = createRoot(document.getElementById('root')!);
  const specs = {
    ...Specs,
    ...ExternalSpecs,
    ...DevSpecs,
  };
  const el = await Dev.render(Pkg, specs, { hrDepth: 3 });
  root.render(<StrictMode>{el}</StrictMode>);
})();
