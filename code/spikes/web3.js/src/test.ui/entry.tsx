import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

export const Imports = {
  'spike.Sample': () => import('../ui.react/Sample.SPEC'),
};

const url = new URL(location.href);
const query = url.searchParams;

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);
  const { Dev } = await import('./index');
  const el = await Dev.render(Pkg, Imports);
  root.render(el);
})();
