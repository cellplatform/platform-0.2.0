import 'symbol-observable';

import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';

const Imports = {
  'sample.MyComponent': () => import('./MySample.SPEC'),
};

const url = new URL(location.href);
const params = url.searchParams;
const isDev = params.has('dev') || params.has('d');

/**
 * Sample entry logic.
 */
(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (isDev) {
    /**
     * NOTE:
     *    The import of the [Dev] module happens dynamically here AFTER
     *    the URL query-string has been interpreted.  This allows the base
     *    module entry to by code-split in such a way that the [Dev Harness]
     *    never gets sent in the normal useage payload.
     */
    const { Dev } = await import('../index.mjs');
    const el = await Dev.render(Pkg, Imports);
    root.render(el);
  } else {
    const { MySample } = await import('../sample/MySample');
    const el = <MySample style={{ Absolute: 0 }} />;
    root.render(el);
  }
})();
