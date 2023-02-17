import { CrdtDocRef } from '.';
import { t, expect, Test } from '../test.ui';
import { Automerge } from './common';

export default Test.describe('CRDT.DocRef', (e) => {
  type D = { count: number; name?: string };

  e.describe('init', (e) => {
    e.it('from initial {object}', (e) => {
      const initial = { count: 0 };
      const doc = CrdtDocRef.init<D>(initial);
      expect(doc.current).to.eql(initial);
      expect(doc.current).to.not.equal(initial); // NB: initialized as an Automerge document.
      expect(doc.id.actor).to.eql(Automerge.getActorId(doc.current));
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });

    e.it('from initial {Automerge} document', (e) => {
      let initial: D = Automerge.init<D>();
      initial = Automerge.change<D>(initial, (doc) => (doc.count = 999));
      const doc = CrdtDocRef.init<D>(initial);
      expect(doc.current).to.eql({ count: 999 });
      expect(doc.current).to.equal(initial);
      expect(doc.id.actor).to.eql(Automerge.getActorId(doc.current));
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });
  });

  e.describe('replace', (e) => {
    e.it('replace', (e) => {
      const doc = CrdtDocRef.init<D>({ count: 0 });
      const fired: t.CrdtDocChange<D>[] = [];
      doc.$.subscribe((e) => fired.push(e));

      const changed = Automerge.change(doc.current, (doc) => (doc.count = 999));
      doc.replace(changed);
      expect(doc.current).to.eql({ count: 999 });

      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('replace');
      expect(fired[0].doc).to.equal(doc.current);
    });

    e.it('throw: not an Automerge document', (e) => {
      const doc = CrdtDocRef.init<D>({ count: 0 });
      const fn = () => doc.replace({ count: 123 });
      expect(fn).to.throw(/Cannot replace with a non-Automerge document/);
    });

    e.it('throw: not the same Automerge document', (e) => {
      const doc1 = CrdtDocRef.init<D>({ count: 1 });
      const doc2 = CrdtDocRef.init<D>({ count: 2 });

      const fn = () => doc1.replace(doc2.current);
      expect(fn).to.throw(/Cannot replace a different document \(ActorID\)/);
    });
  });
});
