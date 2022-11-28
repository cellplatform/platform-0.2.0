import 'symbol-observable';

import { Pkg } from '../index.pkg.mjs';
import { createRoot } from 'react-dom/client';
import { Root } from '../ui.react/Root/index.mjs';

export const Imports = {
  'spike.ui.Root': () => import('../ui.react/Root/dev/Root.SPEC'),
  'spike.ui.Root.dev': () => import('../ui.react/Root/dev/Root.DevEnv.SPEC'),
  'spike.ui.TileOutline': () => import('../ui.react/Tile.Outline/TileOutline.SPEC'),
  'spike.ui.Video.Diagram': () => import('../ui.react/Video.Diagram/ui.VideoDiagram.SPEC'),
  'spike.ui.Video.ProgressBar': () => import('../ui.react/Video.ProgressBar/ui.ProgressBar.SPEC'),
};

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
