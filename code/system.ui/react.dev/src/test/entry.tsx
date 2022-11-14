import 'symbol-observable';

import { createRoot } from 'react-dom/client';
import { Dev } from '../index.mjs';
import { Pkg } from '../index.pkg.mjs';

const Imports = {
  ['sample.MyComponent']: () => import('../sample/MySample.SPEC'),
};

(async () => {
  const el = await Dev.render(Pkg, Imports);
  const root = createRoot(document.getElementById('root')!);
  root.render(el);
})();
