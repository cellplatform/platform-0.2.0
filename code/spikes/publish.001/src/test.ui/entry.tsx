import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root, Imports } from '../ui.react/Root/index.mjs';

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
    root.render(<Root />);
  }
})();
