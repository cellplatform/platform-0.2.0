import { CrdtDoc } from '.';
import { rx, expect, t, Test } from '../test.ui';
import { Automerge } from './common';

export default Test.describe('DocRef', (e) => {
  type D = { count: number; name?: string };

  e.describe('initialize', (e) => {
    e.it('from initial {object}', (e) => {
      const initial = { count: 0 };
      const doc = CrdtDoc.ref<D>(initial);
      expect(doc.current).to.eql(initial);
      expect(doc.current).to.not.equal(initial); // NB: initialized as an Automerge document.
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });

    e.it('from initial {Automerge} document', (e) => {
      let initial: D = Automerge.init<D>();
      initial = Automerge.change<D>(initial, (doc) => (doc.count = 999));
      const doc = CrdtDoc.ref<D>(initial);
      expect(doc.current).to.eql({ count: 999 });
      expect(doc.current).to.equal(initial);
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });
  });

  e.describe('dispose', (e) => {
    e.it('ref.dispose() method', async (e) => {
      const initial = { count: 0 };
      const doc = CrdtDoc.ref<D>(initial);

      let fired = 0;
      doc.dispose$.subscribe(() => fired++);

      expect(doc.isDisposed).to.eql(false);
      doc.dispose();
      doc.dispose();
      expect(fired).to.eql(1);
      expect(doc.isDisposed).to.eql(true);
    });

    e.it('dispose via { dispose$ } option', async (e) => {
      const { dispose, dispose$ } = rx.disposable();
      const doc = CrdtDoc.ref<D>({ count: 0 }, { dispose$ });

      expect(doc.isDisposed).to.eql(false);
      dispose();
      expect(doc.isDisposed).to.eql(true);
    });
  });

  e.describe('properties', (e) => {
    e.it('doc.id.actor (actorID - unique within process)', async (e) => {
      const doc1 = CrdtDoc.ref<D>({ count: 0 });
      expect(doc1.id.actor).to.eql(Automerge.getActorId(doc1.current));
      expect(doc1.id.actor).to.eql(doc1.id.actor); // NB: no change.
      expect(doc1.id.actor.length).to.greaterThan(10);

      const doc2 = CrdtDoc.ref<D>({ count: 0 });
      expect(doc1.id.actor).to.not.eql(doc2.id.actor);

      // NB: new reference from doc-1.
      const doc3 = CrdtDoc.ref<D>(Automerge.from<D>(doc1.current));
      expect(doc3.id.actor).to.not.eql(doc1.id.actor); // Share same underlying CRDT document.
    });
  });

  e.describe('replace', (e) => {
    e.it('replace', (e) => {
      const doc = CrdtDoc.ref<D>({ count: 0 });
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
      const doc = CrdtDoc.ref<D>({ count: 0 });
      const fn = () => doc.replace({ count: 123 });
      expect(fn).to.throw(/Cannot replace with a non-Automerge document/);
    });
  });
});
