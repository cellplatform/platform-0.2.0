import 'symbol-observable';

import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';

console.info(`Pkg:`, Pkg);
const url = new URL(window.location.href);
const queryHas = (...value: string[]) => value.some((v) => url.searchParams.has(v));
const isDev = queryHas('dev', 'd');
const root = createRoot(document.getElementById('root')!);

const Render = {
  async dev() {
    const { Dev } = await import('sys.ui.react.common');
    const { Specs } = await import('./entry.Specs.mjs');
    const el = await Dev.render(Pkg, Specs, { hrDepth: 2 });
    return root.render(el);
  },

  async ref(src: string) {
    const { IFrameRef } = await import('../ui/ui.IFrameRef');
    return root.render(<IFrameRef src={src} />);
  },

  async ember() {
    const { Root } = await import('../ui/ext.Ember');
    return root.render(<Root />);
  },
};

(async () => {
  if (isDev) return Render.dev();
  if (url.pathname === '/ember/') return Render.ember();
  if (url.pathname === '/eusic/') return Render.ref('https://slc-eusic-ph1bc4ut7-tdb.vercel.app/');

  // Default: SLC landing page.
  Render.ref('https://slc-1dot1ggiz.vercel.app/');
})();
