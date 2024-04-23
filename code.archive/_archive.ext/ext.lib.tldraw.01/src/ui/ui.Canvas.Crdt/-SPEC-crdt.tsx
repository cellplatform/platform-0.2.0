import { init } from 'automerge-tldraw';
import { CrdtInfo, TestDb, WebStore, type t } from '../../test.ui';

type TDoc = t.TLStoreSnapshot;
export type SampleCrdtRef = Awaited<ReturnType<typeof SampleCrdt.init>>;

export const SampleCrdt = {
  /**
   * Initialize a sample CRDT data store for the spec.
   */
  async init(docuri?: string, options: { store?: t.Store; dispose$?: t.UntilObservable } = {}) {
    console.debug('SampleCrdt.init', { docuri, options });

    const storage = TestDb.Spec.name;
    const store = options.store ?? WebStore.init({ storage, dispose$: options?.dispose$ });
    const index = await WebStore.index(store);

    const exists = await store.doc.exists(docuri);
    const doc = await store.doc.getOrCreate<TDoc>((d) => null, exists ? docuri : undefined);
    if (!doc.current.store) doc.change(init);

    const render = (style?: t.CssValue) => {
      return (
        <CrdtInfo
          style={style}
          fields={[
            // 'Visible',
            'Repo',
            'Doc',
            'Doc.URI',
            'History',
            'History.Genesis',
            'History.List',
            'History.List.Detail',
            'History.List.NavPaging',
          ]}
          data={{
            repo: { store, index },
            document: { doc },
            history: { doc },
            // visible: { value: true },
          }}
        />
      );
    };

    return { doc, store, storage, render } as const;
  },
} as const;
