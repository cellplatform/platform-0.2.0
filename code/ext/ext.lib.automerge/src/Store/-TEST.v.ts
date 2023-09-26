import { Store } from '.';
import { A, describe, expect, it, rx, type t } from '../test';

export type D = { count?: t.A.Counter };

describe('Store', async () => {
  const store = Store.init();
  const initial: t.DocChange<D> = (d) => (d.count = new A.Counter(0));
  const generator = store.docType<D>(initial);

  it('kind: "crdt:store"', () => {
    expect(store.kind).to.eql('crdt:store');
  });

  describe('Doc', () => {
    it('create and change', async () => {
      const doc1 = await generator();
      const doc2 = await generator();
      doc2.change((d) => d.count?.increment(5));

      expect(doc1.current.count?.value).to.eql(0);
      expect(doc2.current.count?.value).to.eql(5);
    });
  });

  describe('Doc.events', () => {
    describe('lifecycle', () => {
      it('dispose', async () => {
        const doc = await generator();
        const events = doc.events();

        let fired = 0;
        events.dispose$.subscribe(() => fired++);

        expect(events.disposed).to.eql(false);
        events.dispose();
        events.dispose();
        expect(events.disposed).to.eql(true);
        expect(fired).to.eql(1);
      });

      it('lifecycle: dispose$', async () => {
        const doc = await generator();
        const dispose$ = new rx.Subject<void>();
        const events = doc.events(dispose$);

        let fired = 0;
        events.dispose$.subscribe(() => fired++);

        expect(events.disposed).to.eql(false);
        dispose$.next();
        expect(events.disposed).to.eql(true);
        expect(fired).to.eql(1);
      });
    });
  });
});
