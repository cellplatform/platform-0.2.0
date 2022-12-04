import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

export const Imports = {
  'spike.Root': () => import('../ui.react/Root/Root.SPEC'),
};

const url = new URL(location.href);
const query = url.searchParams;

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (query.has('dev')) {
    const { Dev } = await import('./index');
    const el = await Dev.render(Pkg, Imports);
    root.render(el);
  } else {
    const { Root } = await import('../ui.react/Root');
    root.render(<Root />);
  }
})();
