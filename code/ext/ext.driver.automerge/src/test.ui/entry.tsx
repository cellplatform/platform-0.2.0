import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from 'sys.ui.react.common';
import { Pkg } from '../index.pkg.mjs';

/**
 * Initialize
 */
(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs.mjs');

  /**
   * Setup shared-worker and register the URL.
   */
  const { Repo } = await import('../repo');
  const url = await import('./entry.worker.js?sharedworker&url');
  Repo.worker.register(url.default);

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
