import { describe, it, expect, t, A } from '../test';

import { Store } from '.';

export type D = { count?: t.A.Counter };

describe('Store', async () => {
  const store = Store.init();
  const initial: t.DocChange<D> = (d) => (d.count = new A.Counter(0));

  it('kind: "crdt:store"', () => {
    expect(store.kind).to.eql('crdt:store');
  });

  it('create and change', async () => {
    const generator = await store.docType<D>(initial);
    const doc1 = await generator();
    const doc2 = await generator();
    doc2.change((d) => d.count?.increment(5));

    expect(doc1.current.count?.value).to.eql(0);
    expect(doc2.current.count?.value).to.eql(5);
  });
});
