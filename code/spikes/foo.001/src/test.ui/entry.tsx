import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';
import { Dev } from 'sys.ui.react.common';

(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs.mjs');

  const { Repo } = await import('ext.driver.automerge');
  const url = await import('./entry.worker.js?sharedworker&url');
  Repo.sharedWorkerUrl = url.default;

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(<StrictMode>{el}</StrictMode>);
})();
