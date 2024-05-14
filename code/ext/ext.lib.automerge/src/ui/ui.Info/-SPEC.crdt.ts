import { TestDb, WebStore, type t } from '../../test.ui';

type O = Record<string, unknown>;

/**
 * Sample spec CRDT state.
 */
export async function sampleCrdt(options: { debug?: t.StoreDebug } = {}) {
  const { debug } = options;
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage, debug });
  const index = await WebStore.index(store);

  async function docAtIndex<T extends O>(i: number) {
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
