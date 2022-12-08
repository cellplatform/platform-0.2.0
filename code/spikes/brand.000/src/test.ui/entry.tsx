import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';

export const Imports = {
  'ui.Root': () => import('../ui/Root/Root.SPEC'),
  'ui.BrandLayout': () => import('../ui/BrandLayout/BrandLayout.SPEC'),
};

/**
 * User Interface
 */

(async () => {
  const url = new URL(location.href);
  const params = url.searchParams;
  const root = createRoot(document.getElementById('root')!);

  if (params.has('d') || params.has('dev')) {
    const { Dev } = await import('./index');
    const el = await Dev.render(Pkg, Imports);
    root.render(el);
  } else {
    if (params.has('brand') || url.pathname === '/brand/') {
      const { BrandLayout } = await import('../ui/BrandLayout');
      root.render(<BrandLayout />);
      return;
    }

    const { Root } = await import('../ui/Root');
    root.render(<Root />);
  }
})();
