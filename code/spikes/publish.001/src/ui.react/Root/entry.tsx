import 'symbol-observable';

import { Pkg } from '../../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root } from './Root';

const url = new URL(location.href);
const query = url.searchParams;

const Imports = {
  'spike.ui.root.dev': () => import('./dev/Root.DevEnv.SPEC'),
  'spike.ui.root': () => import('./dev/Root.SPEC'),
  'spike.ui.outline': () => import('../Tile.Outline/Tile.Outline.SPEC'),
};

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);

  if (query.has('dev')) {
    const { Dev } = await import('../../test.ui');
    const el = await Dev.render(Pkg, Imports);
    root.render(el);
  } else {
    const el = <Root />;
    root.render(el);
  }
})();
