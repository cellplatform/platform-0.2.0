import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Specs } from './entry.Specs.mjs';

const url = new URL(location.href);
const params = url.searchParams;
const isDev = params.has('dev') || params.has('d');

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (isDev) {
    const { Dev } = await import('./index');
    const el = await Dev.render(Pkg, Specs);
    root.render(el);
  } else {
    const { RootFill } = await import('../ui/Root');
    root.render(<RootFill />);
  }
})();
