import { Store } from '.';
import { type t, Is, Test, expect, A } from '../test.ui';

export type D = { count?: t.A.Counter };

export default Test.describe('Store', (e) => {
  e.it('has repo', (e) => {
    expect(Is.repo(Store.repo)).to.eql(true);
  });

  e.describe('docRef', (e) => {
    const initial: t.DocChange<D> = (d) => (d.count = new A.Counter(0));

    e.it('create (initial)', async (e) => {
      const res1 = await Store.docRef<D>({ initial });
      const res2 = await Store.docRef<D>({ initial });

      expect(res1.handle.state).to.eql('ready');
      expect(res1.uri).to.eql(res1.handle.url);
      expect(res1.current.count?.value).to.eql(0);

      expect(res1.uri).to.not.eql(res2.uri);
    });
  });
});
