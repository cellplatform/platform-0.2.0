import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { RepoContext } from '@automerge/automerge-repo-react-hooks';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';
import { Store } from '../Store';
import { StoreIndexDb } from '../Store.Web.IndexDb';
import { DEFAULTS, type t } from './common';

export type Init = {
  dispose$?: t.UntilObservable;
  network?: boolean | t.NetworkAdapter[];
  storage?: boolean | string | { name?: string };
};

/**
 * Manage an Automerge "repo" on the browser.
 */
export const WebStore = {
  Provider: RepoContext.Provider,

  /**
   * Initialize a new instance of a CRDT store/repo.
   */
  init(options: Init = {}) {
    const network = Wrangle.network(options);
    const storage = Wrangle.storage(options);
    const repo = new Repo({ network, storage: storage.adapter });

    const base = Store.init({ repo, dispose$: options.dispose$ });
    const store: t.WebStore = {
      ...base,
      get disposed() {
        return base.disposed;
      },

      /**
       * Metadata about the store.
       */
      info: { storage: storage.info },

      /**
       * The react <Provider> context.
       */
      Provider(props: { children?: React.ReactNode }) {
        return <WebStore.Provider value={repo}>{props.children}</WebStore.Provider>;
      },
    };

    return store;
  },

  /**
   * Create instance of the store/repo's document Index.
   */
  async index(store: t.WebStore) {
    const db = await StoreIndexDb.init();
    const record = await db.getOrCreate(store);
    return Store.Index.init(store, record.index);
  },
} as const;

/**
 * Helpers
 */
const Wrangle = {
  network(options: Init): t.NetworkAdapter[] {
    const { network } = options;
    if (network === undefined || network === true) return [new BroadcastChannelNetworkAdapter()];
    if (Array.isArray(network)) return network;
    return [];
  },

  storage(options: Init) {
    const { storage } = options;
    const defaultName = DEFAULTS.storage.name;
    const done = (name?: string) => {
      return {
        info: name ? { name } : undefined,
        adapter: name ? new IndexedDBStorageAdapter(name) : undefined,
      } as const;
    };
    if (storage === undefined || storage === true) return done(defaultName);
    if (typeof storage === 'string') return done(storage);
    if (typeof storage === 'object') return done(storage.name || defaultName);
    return done();
  },
} as const;
