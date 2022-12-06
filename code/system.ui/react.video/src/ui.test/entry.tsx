import 'symbol-observable';

import { createRoot } from 'react-dom/client';
import { Dev } from '.';
import { Pkg } from '../index.pkg.mjs';

const Imports = {
  'video.Vimeo': () => import('../ui.components/Vimeo/dev/Vimeo.SPEC'),
  'video.VimeoBackground': () => import('../ui.components/Vimeo/dev/VimeoBackground.SPEC'),
};

(async () => {
  const el = await Dev.render(Pkg, Imports);
  const root = createRoot(document.getElementById('root')!);
  root.render(el);
})();
