import { CrdtInfo, TestDb, WebStore, type t } from '../../test.ui';

type TDoc = { image?: t.ImageBinary | null };

export const SampleCrdt = {
  /**
   * Initialize a sample CRDT data store for the spec.
   */
  async init(docuri?: string, options: { dispose$?: t.UntilObservable } = {}) {
    const storage = TestDb.Spec.name;
    const store = WebStore.init({ storage, dispose$: options?.dispose$ });
    const index = await WebStore.index(store);
    const exists = await store.doc.exists(docuri);
    const doc = await store.doc.getOrCreate<TDoc>((d) => null, exists ? docuri : undefined);

    const update = (image: t.ImageBinary) => doc.change((d) => (d.image = image));
    const render = (style?: t.CssValue) => {
      return (
        <CrdtInfo
          style={style}
          fields={['Repo', 'Doc', 'Doc.URI']}
          repos={{ main: { store, index } }}
          data={{
            repo: 'main',
            document: { uri: doc.uri },
          }}
        />
      );
    };

    return { doc, store, storage, render, update } as const;
  },
} as const;
