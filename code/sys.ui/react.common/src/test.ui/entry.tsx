import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BADGES } from '../common';
import { Pkg } from '../index.pkg';
import { Dev } from '../ui.dev';

(async () => {
  console.info(`Pkg:`, Pkg);
  const badge = BADGES.ci.node;
  const { Specs } = await import('./entry.Specs');

  const el = await Dev.render(Pkg, Specs, { badge, hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
