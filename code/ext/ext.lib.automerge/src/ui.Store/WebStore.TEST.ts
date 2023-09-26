import { WebStore } from '.';
import { A, Is, Test, Time, expect, type t } from '../test.ui';

export type D = { count?: t.A.Counter };

export default Test.describe('WebStore', (e) => {
  const store = WebStore.init();
  const initial: t.DocChange<D> = (d) => (d.count = new A.Counter(0));

  e.describe('init', (e) => {
    e.it('kind: "crdt:store.web"', (e) => {
      expect(store.kind).to.eql('crdt:store.web');
    });

    e.it('Is.repo', (e) => {
      expect(Is.repo(store.repo)).to.eql(true);
    });

    e.it('defaults: storage | network', (e) => {
      const store = WebStore.init();
      const { networkSubsystem, storageSubsystem } = store.repo;
      expect(Is.networkSubsystem(networkSubsystem)).to.eql(true, 'network');
      expect(Is.storageSubsystem(storageSubsystem)).to.eql(true, 'storage');
    });

    e.it('no storage', (e) => {
      const store = WebStore.init({ storage: false });
      expect(Is.storageSubsystem(store.repo.storageSubsystem)).to.eql(false);
      expect(store.repo.storageSubsystem).to.eql(undefined);
    });
  });

  e.describe('store.doc.findOrCreate', (e) => {
    e.it('initial creation', async (e) => {
      const doc1 = await store.doc.findOrCreate<D>(initial);
      const doc2 = await store.doc.findOrCreate<D>(initial);

      expect(doc1.handle.state).to.eql('ready');
      expect(doc1.uri).to.eql(doc1.handle.url);
      expect(doc1.current.count?.value).to.eql(0);

      expect(doc1.uri).to.not.eql(doc2.uri); // NB: A new document retrieved.
      expect(doc1.current).to.not.equal(doc2.current);
      expect(doc1.current).to.eql(doc2.current);
    });

    e.it('retrieve existing (from URI)', async (e) => {
      const doc1 = await store.doc.findOrCreate<D>(initial);
      const doc2 = await store.doc.findOrCreate<D>(initial, doc1.uri);
      expect(doc1.uri).to.eql(doc2.uri);
      expect(doc1.current).to.equal(doc2.current);
    });
  });

  e.describe('store.doc.factory (generator)', (e) => {
    e.it('unique docs', async (e) => {
      const generator = store.doc.factory<D>(initial);
      const doc1 = await generator();
      const doc2 = await generator();

      expect(doc1.uri).to.not.eql(doc2.uri);
      expect(doc1.current).to.eql(doc2.current);
      expect(doc1.current).to.not.equal(doc2.current);
    });

    e.it('retrieve same doc via URI', async (e) => {
      const generator = store.doc.factory<D>(initial);
      const doc1 = await generator();
      const doc2 = await generator(doc1.uri);
      expect(doc1.uri).to.eql(doc2.uri);
      expect(doc1.current).to.equal(doc2.current);
    });
  });

  e.describe('doc: change', (e) => {
    const generator = store.doc.factory<D>(initial);

    e.it('change', async (e) => {
      const doc = await generator();
      expect(doc.current.count?.value).to.eql(0);

      doc.change((d) => d.count?.increment(5));
      expect(doc.current.count?.value).to.eql(5);
    });
  });

  e.describe('sync: BroadcastChannelNetworkAdapter', (e) => {
    const assertCount = (doc: t.DocRefHandle<D>, expected: number) => {
      expect(doc.current.count?.value).to.eql(expected);
    };

    e.it('sync between two documents', async (e) => {
      const store1 = WebStore.init();
      const store2 = WebStore.init();

      const doc1 = await store1.doc.findOrCreate(initial);
      const doc2 = await store2.doc.findOrCreate(initial, doc1.uri);
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

      const doc1 = await store1.doc.findOrCreate(initial);
      const doc2 = await store2.doc.findOrCreate(initial, doc1.uri);
      assertCount(doc1, 0);
      assertCount(doc2, 0);

      doc1.change((d) => d.count?.increment(5));
      await Time.wait(30);

      assertCount(doc1, 5);
      assertCount(doc2, 0);
    });
  });
});
