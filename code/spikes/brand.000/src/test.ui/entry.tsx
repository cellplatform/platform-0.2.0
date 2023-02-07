import 'symbol-observable';

import { createRoot } from 'react-dom/client';

import { Pkg } from '../index.pkg.mjs';
import { Specs } from './entry.SPECS.mjs';

const url = new URL(location.href);
const params = new URL(location.href).searchParams;
const isDev = params.has('dev') || params.has('d');

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (isDev) {
    const { Dev } = await import('sys.ui.react.dev');
    const el = await Dev.render(Pkg, Specs);
    root.render(el);
  } else {
    const { WrangleUrl } = await import('sys.ui.dom');

    if (WrangleUrl.matchAsPathOrQuery(url, '/brand', '/diagram')) {
    }
    const { BrandLayout } = await import('../ui/BrandLayout');
    return root.render(<BrandLayout />);

    // const { Root } = await import('../ui/Root');
    // root.render(<Root />);
  }
})();
