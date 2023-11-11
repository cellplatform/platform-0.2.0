import { Store } from '.';
import { Time, A, describe, expect, it, type t, Is } from '../test';

type D = { count?: t.A.Counter };

describe('StoreIndex', async () => {
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  it('init', async () => {
    const { store } = testSetup();
    const res = await Store.Index.init(store);

    expect(res.kind === 'store:index').to.eql(true);
    expect(res.store).to.equal(store);
    expect(res.index.current.docs).to.eql([]);

    store.dispose();
  });

  it('lifecycle: init → dispose', async () => {
    const { store } = testSetup();
    const indexA = await Store.Index.init(store);
    const indexB = await Store.Index.init(store, indexA.index.uri);

    expect(indexA.index.uri).to.eql(indexB.index.uri);
    expect(indexA.index.current.docs).to.eql([]);

    const events = indexB.index.events();
    expect(store.disposed).to.eql(false);
    expect(events.disposed).to.eql(false);

    store.dispose();
    expect(store.disposed).to.eql(true);
    expect(events.disposed).to.eql(true);
  });

  it('new documents automatically added to index', async () => {
    const { store, initial } = testSetup();
    const { index } = await Store.Index.init(store);
    expect(index.current.docs.length).to.eql(0);

    const sampleDoc = await store.doc.getOrCreate(initial);
    const exists = index.current.docs.some((d) => d.uri === sampleDoc.uri);
    expect(exists).to.eql(true);
    expect(index.current.docs.length).to.eql(1);

    store.dispose();
  });
});
