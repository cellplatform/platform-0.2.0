import { WebStore } from '.';
import { A, Test, Time, expect, type t } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('WebStore: IndexedDBStorageAdapter', (e) => {
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
  const assertCount = (doc: t.DocRef<D>, expected: number) => {
    expect(doc.current.count?.value).to.eql(expected);
  };

  e.it('is persistent', async (e) => {
    const store1 = WebStore.init({ network: false, storage: 'dev.test' });
    const store2 = WebStore.init({ network: false, storage: 'dev.test' });

    const doc1 = await store1.doc.findOrCreate(initial);
    doc1.change((d) => d.count?.increment(5));
    assertCount(doc1, 5);

    await Time.wait(250);
    const doc2 = await store2.doc.findOrCreate(initial, doc1.uri);
    assertCount(doc2, 5); // NB: different store - from [IndexedDB].

    expect(store1.doc.exists(doc1.uri)).to.eql(true);
    expect(store2.doc.exists(doc2.uri)).to.eql(true);
  });

  e.it('not persistent', async (e) => {
    const store1 = WebStore.init({ network: false, storage: false });
    const store2 = WebStore.init({ network: false, storage: false });

    const doc = await store1.doc.findOrCreate(initial);
    doc.change((d) => d.count?.increment(5));
    assertCount(doc, 5);

    expect(store1.doc.exists(doc.uri)).to.eql(true);
    expect(store2.doc.exists(doc.uri)).to.eql(false);
  });
});
