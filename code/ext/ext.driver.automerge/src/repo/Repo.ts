import { Repo } from '@automerge/automerge-repo';
import { MessageChannelNetworkAdapter } from '@automerge/automerge-repo-network-messagechannel';

import { Peer } from './Peer';

/**
 * https://github.com/automerge/automerge-repo/blob/main/examples/automerge-repo-demo-counter
 *
 * 🐷
 * We run the network & storage in a separate file and the tabs themselves are stateless and lightweight.
 * This means we only ever create one websocket connection to the sync server, we only do our writes in one place
 * (no race conditions) and we get local real-time sync without the overhead of broadcast channel.
 * The downside is that to debug any problems with the sync server you'll need to find the shared-worker and inspect it.
 *
 * In Chrome-derived browsers the URL is:
 *    chrome://inspect/#workers.
 *
 * In Firefox:
 *    about:debugging#workers.
 *
 * In Safari:
 *    Develop > Show Web Inspector > Storage > IndexedDB > automerge-repo-demo-counter.
 *
 */
const url = new URL('./Repo.SharedWorker.ts', import.meta.url);
const sharedWorker = new SharedWorker(url, {
  type: 'module',
  name: 'automerge-repo-shared-worker',
});

/**
 * Create a repo and share any documents we create with our
 * local in-browser storage worker.
 */
export const repo = new Repo({
  network: [new MessageChannelNetworkAdapter(sharedWorker.port)],
  async sharePolicy(peerId) {
    console.log('sharePolicy', peerId);
    // return peerId.includes('shared-worker-');
    return Peer.id.is('SharedWorker', peerId);
  },
});
