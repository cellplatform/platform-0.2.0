import 'symbol-observable';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pkg } from '../index.pkg.mjs';
import { Dev } from 'sys.ui.react.common';

import { Repo } from '@automerge/automerge-repo';
import { MessageChannelNetworkAdapter } from '@automerge/automerge-repo-network-messagechannel';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';

/**
 * Setup worker.
 * https://github.com/automerge/automerge-repo/blob/main/examples/automerge-repo-demo-counter
 */
const sharedWorker = new SharedWorker(new URL('../workers/SharedWorker.ts', import.meta.url), {
  type: 'module',
  name: 'automerge-repo-shared-worker',
});

console.log('sharedWorker', sharedWorker);

/* Create a repo and share any documents we create with our local in-browser storage worker. */
const repo = new Repo({
  network: [new MessageChannelNetworkAdapter(sharedWorker.port)],
  sharePolicy: async (peerId) => peerId.includes('shared-worker'),
});

/**
 * Initialize
 */
(async () => {
  console.info(`Pkg:`, Pkg);
  const { Specs } = await import('./entry.Specs.mjs');

  const el = await Dev.render(Pkg, Specs, { hrDepth: 3 });
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <RepoContext.Provider value={repo}>
      <StrictMode>{el}</StrictMode>
    </RepoContext.Provider>,
  );
})();
