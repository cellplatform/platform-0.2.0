import { Store } from '.';
import { A, describe, expect, it, type t } from '../test';

type D = { count?: t.A.Counter };

describe('Store.repo', () => {
  const store = Store.init();
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
  const generator = store.doc.factory<D>(initial);

  it('repo.handles', async () => {
    const repo = store.repo;
    expect(repo.handles).to.eql({});

    const doc = await generator();
    const keys = Object.keys(repo.handles);
    expect(keys).to.eql([Store.Uri.id(doc.uri)]);
  });
});
