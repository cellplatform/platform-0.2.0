import { BroadcastChannel, WebStore, type t } from './common';
import { TestDb } from './TestDb';

type O = Record<string, unknown>;
type Options = { storage?: string; debug?: t.StoreDebug; broadcastAdapter?: boolean };
type T = { docuri?: t.UriString };

/**
 * Sample spec CRDT state.
 */
export const SampleCrdt = {
  /**
   * Common store/factory setup.
   */
  async init(options: Options = {}) {
    const { debug } = options;
    const storage = wrangle.storage(options.storage);
    const name = storage.name;

    const network: t.NetworkAdapterInterface[] = [];
    if (options.broadcastAdapter) network.push(BroadcastChannel.create());

    const store = WebStore.init({ storage, debug, network });
    const index = await WebStore.index(store);

    async function docAtIndex<T extends O>(i: t.Index) {
      const doc = index.doc.current.docs[i];
      const exists = await index.store.doc.exists(doc?.uri, { timeout: 500 });
      return exists ? await index.store.doc.get<T>(doc.uri) : undefined;
    }

    return {
      name,
      repo: { name, store, index },
      docAtIndex,
    } as const;
  },

  /**
   * Stateful dev-harness helpers.
   */
  dev(store: t.Store, debug: t.Immutable<T>) {
    return {
      get docuri() {
        return debug.current.docuri;
      },

      async get() {
        const uri = debug.current.docuri;
        const exists = uri ? await store.doc.exists(uri) : false;
        const doc = exists ? await store.doc.get(uri) : await store.doc.getOrCreate((d) => null);
        debug.change((d) => (d.docuri = doc?.uri));
        return doc;
      },

      async delete() {
        const uri = debug.current.docuri;
        if (uri) await store.doc.delete(uri);
        debug.change((d) => (d.docuri = undefined));
        return undefined;
      },
    } as const;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  storage(input?: string) {
    const name = input ?? TestDb.Spec.name;
    return { name };
  },
} as const;
