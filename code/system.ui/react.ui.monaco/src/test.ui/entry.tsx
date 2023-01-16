import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';
import { Specs } from './entry.Specs.mjs';

(async () => {
  const el = await Dev.render(Pkg, Specs);
  const root = createRoot(document.getElementById('root')!);
  root.render(el);
})();
