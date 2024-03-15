import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

import { Store } from '../Store';
import { WebStoreIndex as Index } from '../Store.Web.Index';
import { StoreIndexDb } from '../Store.Web.IndexDb';
import { DEFAULTS, Delete, Is, type t } from './common';

type Init = {
  network?: boolean | t.NetworkAdapterInterface[];
  storage?: boolean | string | { name?: string };
  dispose$?: t.UntilObservable;
};

/**
 * Manage an Automerge "repo" on the browser.
 */
export const WebStore = {
  Provider: RepoContext.Provider,
  handle: Store.handle,

  get IndexDb() {
    return StoreIndexDb;
  },

  /**
   * Create instance of the store/repo's document Index.
   */
  Index,
  index: Index.init,

  /**
   * Initialize a new instance of a CRDT store/repo.
   */
  init(options: Init = {}) {
    const network = Wrangle.network(options);
    const storage = Wrangle.storage(options);
    const repo = new Repo({ network, storage });

    const base = Store.init({ repo, dispose$: options.dispose$ });
    const store: t.WebStore = {
      ...base,
      get disposed() {
        return base.disposed;
      },

      /**
       * Metadata about the store.
       */
      get info() {
        return Wrangle.info(options);
      },

      /**
       * The react <Provider> context.
       */
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
const Wrangle = {
  network(options: Init): t.NetworkAdapterInterface[] {
    const { network } = options;
    if (network === undefined || network === true) return [new BroadcastChannelNetworkAdapter()];
    if (Array.isArray(network)) return network;
    return [];
  },

  networkKinds(options: Init) {
    const { network } = options;
    const kinds: t.StoreNetworkKind[] = [];
    if (network === undefined || network === true) kinds.push('BroadcastChannel');
    if (Array.isArray(network)) {
      network.forEach((item) => {
        if (Is.broadcastChannel(item)) kinds.push('BroadcastChannel');
      });
    }
    return kinds;
  },

  storage(options: Init) {
    const { storage } = options;
    const defaultName = DEFAULTS.storage.name;
    const done = (name?: string | null) => {
      return name ? new IndexedDBStorageAdapter(name) : undefined;
    };
    if (storage === false) return done(null);
    if (storage === undefined || storage === true) return done(defaultName);
    if (typeof storage === 'string') return done(storage);
    if (typeof storage === 'object') return done(storage.name || defaultName);
    return done();
  },

  storageName(options: Init) {
    const { storage } = options;
    const defaultName = DEFAULTS.storage.name;
    if (storage === false) return undefined;
    if (storage === undefined || storage === true) return defaultName;
    if (typeof storage === 'string') return storage;
    if (typeof storage === 'object') return storage.name || defaultName;
    return '';
  },

  info(options: Init): t.WebStoreInfo {
    const storage = Wrangle.storageName(options);
    const network = Wrangle.networkKinds(options);
    return Delete.undefined({
      storage: storage ? { kind: 'IndexedDb', name: storage } : undefined,
      network: network.length > 0 ? { kinds: network } : undefined,
    });
  },
} as const;
