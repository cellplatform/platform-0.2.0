import { BroadcastChannelNetworkAdapter, WebStore, type t } from './common';
import { TestDb } from './TestDb';

type O = Record<string, unknown>;

/**
 * Sample spec CRDT state.
 */
export async function sampleCrdt(
  options: { debug?: t.StoreDebug; broadcastAdapter?: boolean } = {},
) {
  const { debug } = options;
  const storage = TestDb.Spec.name;

  const network: t.NetworkAdapterInterface[] = [];
  if (options.broadcastAdapter) network.push(new BroadcastChannelNetworkAdapter());

  const store = WebStore.init({ storage, debug, network });
  const index = await WebStore.index(store);

  async function docAtIndex<T extends O>(i: t.Index) {
    const doc = index.doc.current.docs[i];
    const exists = await index.store.doc.exists(doc?.uri, { timeout: 500 });
    return exists ? await index.store.doc.get<T>(doc.uri) : undefined;
  }

  return {
    storage: { name: storage },
    store,
    index,
    docAtIndex,
  } as const;
}
