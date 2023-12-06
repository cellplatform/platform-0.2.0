import { Doc } from '.';
import { Store } from '../Store';
import { describe, expect, it, type t } from '../test';

type D = { count: number; msg?: string };

describe('Doc.Patch', async () => {
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = 0);
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  const { store, generator } = testSetup();

  describe('Patch.apply', () => {
    it('single patch', async () => {
      const doc1 = await generator();
      const doc2 = await generator();
      const events = doc1.events();
      let patches: t.Patch[] = [];
      events.changed$.subscribe((e) => (patches = e.patches));

      doc1.change((d) => d.count++);
      expect(patches.length).to.eql(1);
      expect(doc1.current).to.eql({ count: 1 });
      expect(doc2.current).to.eql({ count: 0 });

      doc2.change((d) => Doc.Patch.apply(d, patches[0]));
      expect(doc1.current).to.eql({ count: 1 });
      expect(doc2.current).to.eql({ count: 1 });

      events.dispose();
    });

    it('multiple patches', async () => {
      const doc1 = await generator();
      const doc2 = await generator();
      const events = doc1.events();
      let patches: t.Patch[] = [];
      events.changed$.subscribe((e) => (patches = e.patches));

      doc1.change((d) => {
        d.count++;
        d.msg = 'hello';
      });
      expect(patches.length).to.eql(3);
      expect(doc1.current).to.eql({ count: 1, msg: 'hello' });
      expect(doc2.current).to.eql({ count: 0 });

      let res: D | undefined;
      doc2.change((d) => (res = Doc.Patch.apply(d, patches)));
      expect(doc1.current).to.eql({ count: 1, msg: 'hello' });
      expect(doc2.current).to.eql({ count: 1, msg: 'hello' });
      expect(res).to.eql({ count: 1, msg: 'hello' });

      events.dispose();
    });

    it('pass: docRef<T>', async () => {
      const doc1 = await generator();
      const doc2 = await generator();
      const events = doc1.events();
      let patches: t.Patch[] = [];
      events.changed$.subscribe((e) => (patches = e.patches));

      doc1.change((d) => {
        d.count++;
        d.msg = 'hello';
      });
      expect(patches.length).to.eql(3);
      expect(doc1.current).to.eql({ count: 1, msg: 'hello' });
      expect(doc2.current).to.eql({ count: 0 });

      const res = Doc.Patch.apply(doc2, patches);
      expect(doc1.current).to.eql({ count: 1, msg: 'hello' });
      expect(doc2.current).to.eql({ count: 1, msg: 'hello' });
      expect(res).to.eql({ count: 1, msg: 'hello' });

      events.dispose();
    });
  });

  it('|test.dispose|', () => store.dispose());
});
