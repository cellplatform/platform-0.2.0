import { Store } from '.';
import { Time, A, describe, expect, it, type t } from '../test';

type D = { count?: t.A.Counter };

describe('StoreIndex', async () => {
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  it('lifecycle: init → dispose', async () => {
    const { store } = testSetup();
    const indexA = await Store.Index.init(store);
    const indexB = await Store.Index.init(store, indexA.doc.uri);

    expect(indexA.doc.uri).to.eql(indexB.doc.uri);
    expect(indexA.doc.current.docs).to.eql([]);

    const events = indexB.doc.events();
    expect(store.disposed).to.eql(false);
    expect(events.disposed).to.eql(false);

    store.dispose();
    expect(store.disposed).to.eql(true);
    expect(events.disposed).to.eql(true);
  });

  it('new documents automatically added to index', async () => {
    const { store, initial } = testSetup();
    const index = await Store.Index.init(store);

    expect(index.doc.current.docs).to.eql([]);

    const doc = await store.doc.getOrCreate(initial);
    const exists = index.doc.current.docs.some((d) => d.uri === doc.uri);
    expect(exists).to.eql(true);

    store.dispose();
  });
});
