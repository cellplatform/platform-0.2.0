import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
// import { Root, Imports } from '../ui.react/Root/index.mjs';

const url = new URL(location.href);
const query = url.searchParams;

export const Imports = {
  'hooks.useSizeObserver': () => import('../hooks/useSizeObserver.SPEC'),
  // 'spike.ui.Root.dev': () => import('./dev/Root.DevEnv.SPEC'),
  // 'spike.ui.TileOutline': () => import('../Tile.Outline/TileOutline.SPEC'),
  // 'spike.ui.VideoDiagram': () => import('../VideoDiagram/VideoDiagram.SPEC'),
};

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);
  const { Dev } = await import('./index');
  const el = await Dev.render(Pkg, Imports);
  root.render(el);
  // if (query.has('dev')) {
  // } else {
  //   root.render(<Root />);
  // }
})();
