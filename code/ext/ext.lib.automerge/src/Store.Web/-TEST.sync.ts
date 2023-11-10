import { WebStore } from '.';
import { A, Test, Time, expect, type t } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('Store.Web: BroadcastChannelNetworkAdapter', (e) => {
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
  const assertCount = (doc: t.DocRef<D>, expected: number) => {
    expect(doc.current.count?.value).to.eql(expected);
  };

  e.it('sync between two documents', async (e) => {
    const store1 = WebStore.init({ storage: false });
    const store2 = WebStore.init({ storage: false });

    const doc1 = await store1.doc.getOrCreate(initial);
    await Time.wait(250);
    const doc2 = await store2.doc.getOrCreate(initial, doc1.uri);
    assertCount(doc1, 0);
    assertCount(doc2, 0);

    doc1.change((d) => d.count?.increment(5));
    await Time.wait(30);

    assertCount(doc1, 5);
    assertCount(doc2, 5);
  });

  e.it('not synced: no network adapter', async (e) => {
    const store1 = WebStore.init({ network: false });
    const store2 = WebStore.init({ network: false });

    const doc1 = await store1.doc.getOrCreate(initial);
    await Time.wait(250);
    const doc2 = await store2.doc.getOrCreate(initial, doc1.uri);
    assertCount(doc1, 0);
    assertCount(doc2, 0);

    doc1.change((d) => d.count?.increment(5));
    await Time.wait(30);

    assertCount(doc1, 5);
    assertCount(doc2, 0);
  });
});
