import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

import { Store } from '../Store';

/**
 * Manage an Automerge repo on the browser.
 */
export const WebStore = {
  init() {
    const repo = new Repo({
      network: [new BroadcastChannelNetworkAdapter()],
      storage: new IndexedDBStorageAdapter(),
    });

    console.log('repo', repo);

    return { ...Store.init(repo), kind: 'crdt:store.web' };
  },
} as const;
