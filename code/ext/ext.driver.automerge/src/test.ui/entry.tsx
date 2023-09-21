import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dev } from 'sys.ui.react.common';
import { Pkg } from '../index.pkg.mjs';

import { Repo } from '../repo';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';

/**
 * Initialize
 */
(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs.mjs');

  const repo = await Repo.ui();
  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <RepoContext.Provider value={repo}>
      <StrictMode>{el}</StrictMode>
    </RepoContext.Provider>,
  );
})();
