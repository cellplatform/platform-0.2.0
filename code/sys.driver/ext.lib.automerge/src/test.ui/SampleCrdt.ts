import { BroadcastChannel, WebStore, type t } from './common';
import { TestDb } from './TestDb';

type O = Record<string, unknown>;
type Options = { storage?: string; debug?: t.StoreDebug; broadcastAdapter?: boolean };
type T = { docuri?: t.UriString };
type N = t.NetworkAdapterInterface;

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

    const network: t.NetworkAdapterInterface[] = [];
    if (options.broadcastAdapter) network.push(BroadcastChannel.create());

    const store = WebStore.init({ storage, debug, network });
    const index = await WebStore.index(store);

    async function docAtIndex<T extends O>(i: t.Index) {
      const doc = index.doc.current.docs[i];
      const exists = await index.store.doc.exists(doc?.uri, { timeout: 500 });
      return exists ? await index.store.doc.get<T>(doc.uri) : undefined;
    }

    return { storage, store, index, docAtIndex } as const;
  },

  /**
   * Stateful dev-harness helpers.
   */
  dev(state: t.DevCtxState<T>, local: T, store: t.Store) {
    return {
      get docuri() {
        return local.docuri;
      },

      async get() {
        const uri = state.current.docuri;
        const exists = uri ? await store.doc.exists(uri) : false;
        const doc = exists ? await store.doc.get(uri) : await store.doc.getOrCreate((d) => null);
        state.change((d) => (local.docuri = d.docuri = doc?.uri));
        return doc;
      },

      async delete() {
        const uri = state.current.docuri;
        if (uri) await store.doc.delete(uri);
        state.change((d) => (local.docuri = d.docuri = undefined));
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
