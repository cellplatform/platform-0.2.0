import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';

const Imports = {
  'ui.Icon': () => import('../ui.Icon/dev/Icon.SPEC'),
  'ui.Spinner': () => import('../ui.Spinner/Spinner.SPEC'),
  'ui.Center': () => import('../ui.Center/Center.SPEC'),
};

(async () => {
  const el = await Dev.render(Pkg, Imports);
  const root = createRoot(document.getElementById('root')!);
  root.render(el);
})();
