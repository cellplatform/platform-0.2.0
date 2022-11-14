import 'symbol-observable';

import { Pkg } from '../../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root } from './Root';

const url = new URL(location.href);
const query = url.searchParams;

const Imports = {
  'spike.ui.Root.dev': () => import('./dev/Root.DevEnv.SPEC'),
  'spike.ui.Root': () => import('./dev/Root.SPEC'),
  'spike.ui.Outline': () => import('../Tile.Outline/Tile.Outline.SPEC'),
  'spike.ui.VideoDiagram': () => import('../VideoDiagram/VideoDiagram.SPEC'),
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
