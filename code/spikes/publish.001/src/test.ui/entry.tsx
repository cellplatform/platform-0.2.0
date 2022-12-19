import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root } from '../ui/Root/index.mjs';

export const Imports = {
  'spike.ui.Root': () => import('../ui/Root/dev/Root.SPEC'),
  'spike.ui.Root.dev': () => import('../ui/Root/dev/Root.DevEnv.SPEC'),
  'spike.ui.TileOutline': () => import('../ui/Tile.Outline/TileOutline.SPEC'),
  'spike.ui.Video.Diagram': () => import('../ui/Video.Diagram/ui.VideoDiagram.SPEC'),
  'spike.ui.Video.ProgressBar': () => import('../ui/Video.ProgressBar/ui.ProgressBar.SPEC'),
};

const url = new URL(location.href);
const params = url.searchParams;
const isDev = params.has('dev') || params.has('d');

/**
 * User Interface
 */

(async () => {
  const root = createRoot(document.getElementById('root')!);
  if (isDev) {
    const { Dev } = await import('./index');
    const el = await Dev.render(Pkg, Imports);
    root.render(el);
  } else {
    root.render(<Root />);
  }
})();
