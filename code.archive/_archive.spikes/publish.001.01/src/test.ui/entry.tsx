import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root } from '../ui/Root';
import { Specs } from './entry.Specs.mjs';

const url = new URL(location.href);
const params = url.searchParams;
const isDev = params.has('dev') || params.has('d');

const BADGE_CI = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml',
};

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);
  if (isDev) {
    const { Dev } = await import('./index');
    const el = await Dev.render(Pkg, Specs, { badge: BADGE_CI, hrDepth: 2 });
    root.render(el);
  } else {
    root.render(<Root />);
  }
})();
