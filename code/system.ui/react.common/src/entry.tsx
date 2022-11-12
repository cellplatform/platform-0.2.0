import { createRoot } from 'react-dom/client';
import { Dev } from './test.ui';
import { SpecList } from './test.ui/SpecList';
import { Pkg } from './index.pkg.mjs';

const url = new URL(window.location.href);
const params = url.searchParams;

const Imports = {
  ['ui.Icon']: () => import('./ui.Icon/dev/Icon.SPEC'),
  ['ui.Spinner']: () => import('./ui.Spinner/Spinner.SPEC'),
  ['ui.ZoomAndPan']: () => import('./ui.ZoomAndPan/ZoomAndPan.SPEC'),
};

/**
 * MAIN INIT
 *   Dev.Harness => (Load Router)
 */
(async () => {
  let _module: any;

  /**
   * Interpret URL parameters
   */
  const KEY = { DEV: 'dev' };
  if (params.has(KEY.DEV)) {
    /**
     * QUERY: ?dev=<namespace>
     */
    const dev = params.get(KEY.DEV) ?? '';

    if (dev && Object.keys(Imports).includes(dev)) {
      const matches = Object.keys(Imports)
        .filter((namespace) => namespace === dev)
        .map((namespace) => ({ namespace, fn: (Imports as any)[namespace] }));

      if (matches[0]) {
        const res = await matches[0].fn();
        if (typeof res === 'object') _module = res.default;
      }
    }
  }

  /**
   * Render UI.
   */
  const root = createRoot(document.getElementById('root')!);

  if (_module) {
    const el = <Dev.Harness spec={_module} style={{ Absolute: 0 }} />;
    return root.render(el);
  }

  /**
   * Default Index List
   */
  const el = <SpecList title={Pkg.name} imports={Imports} style={{ Absolute: 0 }} />;
  return root.render(el);
})();
