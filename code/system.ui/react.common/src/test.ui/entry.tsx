import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';
import { Dev } from '../ui.dev';

(async () => {
  console.info(`Pkg:`, Pkg);
  const badge = Dev.ModuleList.DEFAULTS.badge;
  const { Specs } = await import('./entry.Specs.mjs');

  const keyboard = false;
  const el = await Dev.render(Pkg, Specs, { badge, hrDepth: 3, keyboard });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
