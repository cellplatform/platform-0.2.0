import { BroadcastChannelNetworkAdapter, WebStore, type t } from './common';
import { TestDb } from './TestDb';

type O = Record<string, unknown>;
type Options = { storage?: string; debug?: t.StoreDebug; broadcastAdapter?: boolean };

/**
 * Sample spec CRDT state.
 */
export const SampleCrdt = {
  async init(options: Options = {}) {
    const { debug } = options;
    const storage = wrangle.storage(options.storage);

    const network: t.NetworkAdapterInterface[] = [];
    if (options.broadcastAdapter) network.push(new BroadcastChannelNetworkAdapter());

    const store = WebStore.init({ storage, debug, network });
    const index = await WebStore.index(store);

    async function docAtIndex<T extends O>(i: t.Index) {
      const doc = index.doc.current.docs[i];
      const exists = await index.store.doc.exists(doc?.uri, { timeout: 500 });
      return exists ? await index.store.doc.get<T>(doc.uri) : undefined;
    }

    return { storage, store, index, docAtIndex } as const;
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
