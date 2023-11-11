import { WebStore } from '.';
import { A, Test, expect, toObject, type t } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('Store.Web: Meta', (e) => {
  const name = 'dev.test';
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));

  e.describe('Index', (e) => {
    e.it('disposes of Index events when root Store is disposed', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const meta = await WebStore.meta(store);
      const events = meta.ref.events();

      store.dispose();
      expect(events.disposed).to.eql(true); // NB: because parent store disposed.
    });

    e.it('on ⚡️ new document event → adds to index', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const meta = await WebStore.meta(store);
      const events = meta.ref.events();

      const fired: t.RepoIndex[] = [];
      events.changed$.subscribe((e) => fired.push(toObject(e.doc)));

      const sample = await store.doc.getOrCreate(initial);
      const exists = meta.ref.current.docs.some((d) => d.uri === sample.uri);
      expect(exists).to.eql(true);

      expect(fired.length).to.eql(1);
      expect(fired[0].docs[0].uri).to.eql(sample.uri);

      store.dispose();
    });

    e.it('on ⚡️ delete document event → removes from index', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const meta = await WebStore.meta(store);
      const events = meta.ref.events();

      const sample = await store.doc.getOrCreate(initial);
      expect(meta.ref.current.docs[0].uri).to.eql(sample.uri);

      // Delete the document from the repo.
      store.repo.delete(sample.uri);

      // sample.

      /**
       * TODO 🐷
       */
      store.dispose();
    });
  });
});
