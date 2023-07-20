import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';

console.info(`Pkg:`, Pkg);
const url = new URL(window.location.href);
const isDev = url.searchParams.has('dev');
const root = createRoot(document.getElementById('root')!);

const Render = {
  async dev() {
    const { Dev } = await import('sys.ui.react.common');
    const { Specs } = await import('./entry.Specs.mjs');
    const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
    return root.render(el);
  },

  async iframe(src: string) {
    const { RefIFrame } = await import('../ui/Ref.IFrame');
    return root.render(<RefIFrame src={src} />);
  },

  async ember() {
    const { Root } = await import('../ui/Landing.Ember');
    return root.render(<Root />);
  },
};

(async () => {
  if (isDev) return Render.dev();
  if (url.pathname === '/ember/') return Render.ember();
  Render.iframe('https://slc-1dot1ggiz.vercel.app/'); // SLC landing page.
})();
