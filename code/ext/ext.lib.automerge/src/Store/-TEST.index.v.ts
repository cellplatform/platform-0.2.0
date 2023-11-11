import { Store } from '.';
import { A, describe, expect, it, type t } from '../test';

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
    expect(res.ref.current.docs).to.eql([]);

    store.dispose();
  });

  it('lifecycle: init → dispose', async () => {
    const { store } = testSetup();
    const indexA = await Store.Index.init(store);
    const indexB = await Store.Index.init(store, indexA.ref.uri);

    expect(indexA.ref.uri).to.eql(indexB.ref.uri);
    expect(indexA.ref.current.docs).to.eql([]);

    const events = indexB.ref.events();
    expect(store.disposed).to.eql(false);
    expect(events.disposed).to.eql(false);

    store.dispose();
    expect(store.disposed).to.eql(true);
    expect(events.disposed).to.eql(true);
  });

  it('new documents automatically added to index', async () => {
    const { store, initial } = testSetup();
    const meta = await Store.Index.init(store);
    expect(meta.ref.current.docs.length).to.eql(0);

    const sample = await store.doc.getOrCreate(initial);
    expect(meta.ref.current.docs[0].uri).to.eql(sample.uri);
    expect(meta.exists(sample.uri)).to.eql(true);

    store.dispose();
  });

  it('deleted documents automatically removed from index', async () => {
    const { store, initial } = testSetup();
    const meta = await Store.Index.init(store);

    const sample = await store.doc.getOrCreate(initial);
    expect(meta.ref.current.docs[0].uri).to.eql(sample.uri);
    expect(meta.exists(sample.uri)).to.eql(true);

    store.repo.delete(sample.uri);
    expect(meta.ref.current.docs).to.eql([]);
    expect(meta.exists(sample.uri)).to.eql(false);

    store.dispose();
  });
});
