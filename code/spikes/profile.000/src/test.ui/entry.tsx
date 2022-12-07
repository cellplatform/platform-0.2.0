import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

export const Specs = {
  'ui.Root': () => import('../ui/Root/Root.SPEC'),
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
    const el = await Dev.render(Pkg, Specs);
    root.render(el);
  } else {
    const { Root } = await import('../ui/Root');
    root.render(<Root />);
  }
})();
