import { WebStore } from '.';
import { A, Test, expect, type t, toObject } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('Store.Web: Meta', (e) => {
  const name = 'dev.test';
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));

  e.describe('Index', (e) => {
    e.it('disposes of sub-events when root store is disposed', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const meta = await WebStore.meta(store);
      const events = meta.index.events();

      store.dispose();
      expect(events.disposed).to.eql(true); // NB: because parent store disposed.
    });

    e.it('event: on ⚡️ new document → stores in index (automatically)', async (e) => {
      const store = WebStore.init({ network: false, storage: { name } });
      const { index } = await WebStore.meta(store);
      const events = index.events();

      const fired: t.RepoIndex[] = [];
      events.changed$.subscribe((e) => fired.push(toObject(e.doc)));

      const doc = await store.doc.getOrCreate(initial);
      const exists = index.current.docs.some((d) => d.uri === doc.uri);
      expect(exists).to.eql(true);

      expect(fired.length).to.eql(1);
      expect(fired[0].docs[0].uri).to.eql(doc.uri);

      store.dispose();
    });
  });
});
