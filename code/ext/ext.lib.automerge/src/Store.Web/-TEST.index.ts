import { WebStore } from '.';
import { A, Test, expect, type t } from '../test.ui';

type D = { count?: t.A.Counter };

export default Test.describe('Store.Web: Index', (e) => {
  const name = 'dev.test';
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));

  e.it('event: on new document → stores in index', async (e) => {
    const store = WebStore.init({ network: false, storage: { name } });
    const index = await WebStore.index(store);
    const doc = await store.doc.getOrCreate(initial);
    const exists = index.index.current.docs.some((d) => d.uri === doc.uri);
    expect(exists).to.eql(true);
    store.dispose();
  });
});
