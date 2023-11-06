import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { Store } from '../Store';
import { type t } from './common';

export type InitArgs = {
  network?: boolean | t.NetworkAdapter[];
  storage?: boolean;
};

/**
 * Manage an Automerge repo on the browser.
 */
export const WebStore = {
  Provider: RepoContext.Provider,

  /**
   * Initialize a new instance of a CRDT repo.
   */
  init(options: InitArgs = {}) {
    const repo = new Repo({
      network: Wrangle.network(options),
      storage: Wrangle.storage(options),
    });
    const store: t.WebStore = {
      ...Store.init(repo),
      Provider(props: { children?: React.ReactNode }) {
        return <WebStore.Provider value={repo}>{props.children}</WebStore.Provider>;
      },
    };
    return store;
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  network(options: InitArgs): t.NetworkAdapter[] {
    const { network } = options;
    if (network === undefined || network === true) return [new BroadcastChannelNetworkAdapter()];
    if (Array.isArray(network)) return network;
    return [];
  },

  storage(options: InitArgs): t.StorageAdapter | undefined {
    const { storage } = options;
    if (storage === undefined || storage === true) return new IndexedDBStorageAdapter();
    if (typeof storage === 'object') return storage;
    return;
  },
} as const;
