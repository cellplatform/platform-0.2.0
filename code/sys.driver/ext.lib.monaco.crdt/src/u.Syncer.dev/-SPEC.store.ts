import { TestDb } from '../test.ui';
import { Time, WebStore, type t } from './common';

export type D = { count: number; sample?: t.SampleDoc };

export async function setupStore(docname: string) {
  const db = TestDb.Spec;
  const store = WebStore.init({ storage: db.name, network: false });
  const index = await WebStore.index(store);
  const doc = await getOrCreateDoc(store, index, docname)!;
  return { db, store, index, doc } as const;
}

export async function getOrCreateDoc(store: t.Store, index: t.StoreIndex, docname: string) {
  const findUri = () => index.doc.current.docs.find((d) => d.name === docname)?.uri;

  if (!findUri()) {
    const doc = await store.doc.getOrCreate<D>((d) => (d.count = 0));
    await Time.wait(0);
    index.doc.change((d) => {
      const i = d.docs.findIndex((m) => m.uri === doc.uri);
      if (i > -1) d.docs[i].name = docname;
    });
  }

  const uri = findUri();
  if (!uri) throw new Error(`Failed while creating sample CRDT document`);
  return (await store.doc.get<D>(uri))!;
}
