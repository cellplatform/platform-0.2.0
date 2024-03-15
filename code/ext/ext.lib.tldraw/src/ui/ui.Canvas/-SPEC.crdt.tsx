import { init } from 'automerge-tldraw';
import { CrdtInfo, TestDb, WebStore, type t } from '../../test.ui';

type TDoc = t.TLStoreSnapshot;

export const SampleCrdt = {
  /**
   * Initialize a sample CRDT data store for the spec.
   */
  async init(docuri?: string, options: { dispose$?: t.UntilObservable } = {}) {
    const storage = TestDb.Spec.name;
    const store = WebStore.init({ storage, dispose$: options?.dispose$ });
    const index = await WebStore.index(store);
    const exists = await store.doc.exists(docuri);

    const doc = await store.doc.getOrCreate<TDoc>((d) => {}, exists ? docuri : undefined);
    if (!doc.current.store) doc.change(init);

    const render = (style?: t.CssValue) => {
      return (
        <CrdtInfo
          style={style}
          fields={['Repo', 'Doc', 'Doc.URI']}
          data={{
            repo: { store, index },
            document: { doc },
          }}
        />
      );
    };

    return { doc, store, storage, render } as const;
  },
} as const;