import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';
import { Specs, DevSpecs } from './entry.Specs.mjs';

(async () => {
  const root = createRoot(document.getElementById('root')!);
  const el = await Dev.render(Pkg, { ...Specs, ...DevSpecs });
  root.render(el);
})();
