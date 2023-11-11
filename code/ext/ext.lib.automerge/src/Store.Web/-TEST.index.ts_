import { WebStore } from '.';
import { A, Test, expect, toObject, type t } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('Store.Web: Index', (e) => {
  const name = 'dev.test';
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));

  e.it('disposes of Index events when store/repo is disposed', async (e) => {
    const store = WebStore.init({ network: false, storage: { name } });
    const index = await WebStore.index(store);
    const events = index.doc.events();

    store.dispose();
    expect(events.disposed).to.eql(true); // NB: because parent store disposed.
  });

  e.it('multiple instances from store yeild same index URI', async (e) => {
    const store = WebStore.init({ network: false, storage: { name } });
    const index1 = await WebStore.index(store);
    const index2 = await WebStore.index(store);

    // index1.ref.
    console.log('index1.uri', index1.doc.uri);
    console.log('index2.uri', index2.doc.uri);

    //
  });

  e.describe('auto sync with repo', (e) => {
    e.it('repo: on ⚡️ new document event → adds to index', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const index = await WebStore.index(store);
      const events = index.doc.events();

      const fired: t.RepoIndex[] = [];
      events.changed$.subscribe((e) => fired.push(toObject(e.doc)));

      const sample = await store.doc.getOrCreate(initial);
      const exists = index.doc.current.docs.some((d) => d.uri === sample.uri);
      expect(exists).to.eql(true);

      expect(fired.length).to.eql(1);
      expect(fired[0].docs[0].uri).to.eql(sample.uri);

      store.dispose();
    });

    e.it('repo: on ⚡️ delete document event → removes from index', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const index = await WebStore.index(store);
      const events = index.doc.events();

      const fired: t.RepoIndex[] = [];
      events.changed$.subscribe((e) => fired.push(toObject(e.doc)));

      const sample = await store.doc.getOrCreate(initial);
      expect(index.doc.current.docs[0].uri).to.eql(sample.uri);

      store.repo.delete(sample.uri);
      expect(index.doc.current.docs).to.eql([]);
      expect(fired[1].docs).to.eql([]);

      store.dispose();
    });
  });
});
