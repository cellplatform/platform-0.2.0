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
    describe('lifecycle', async () => {
      const doc = await generator();

      it('multiple instances', () => {
        const events1 = doc.events();
        const events2 = doc.events();
        expect(events1).to.not.equal(events2);
      });

      it('dispose', async () => {
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

    it('changed', async () => {
      const doc = await generator();
      const events = doc.events();

      let fired: t.DocChanged<D>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      const increment = () => doc.change((d) => d.count?.increment(1));
      increment();
      expect(doc.current.count?.value).to.eql(1);
      expect(fired.length).to.eql(1);

      const e = fired[0];
      expect(e.uri).to.eql(doc.uri);
      expect(e.doc).to.eql(doc.current);
      expect(e.patches.length).to.eql(1);
      expect(e.patches[0].action).to.eql('inc');
      expect(e.patchInfo.source).to.eql('change');
      expect(e.patchInfo.before.count?.value).to.eql(0);
      expect(e.patchInfo.after.count?.value).to.eql(1);

      events.dispose();
      increment();
      increment();
      expect(fired.length).to.eql(1); // NB: no change after dispose.
    });
  });
});
