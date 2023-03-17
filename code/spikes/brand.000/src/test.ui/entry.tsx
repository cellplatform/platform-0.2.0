import 'symbol-observable';

import { createRoot } from 'react-dom/client';

import { Pkg } from '../index.pkg.mjs';

const url = new URL(location.href);
const params = new URL(location.href).searchParams;
const isDev = params.has('dev') || params.has('d');

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (isDev) {
    /**
     * Development
     */
    const { Dev } = await import('sys.ui.react.dev');
    const { Specs } = await import('./entry.SPECS.mjs');
    const el = await Dev.render(Pkg, Specs);
    root.render(el);
  } else {
    /**
     * Production
     */
    // const { Temp } = await import('../ui/Temp');
    // return root.render(<Temp />);

    const { WrangleUrl } = await import('sys.ui.dom');

    if (WrangleUrl.matchAsPathOrQuery(url, '/brand', '/diagram')) {
    }
    const { BrandLayout } = await import('../ui/BrandLayout');
    return root.render(<BrandLayout />);
  }
})();
