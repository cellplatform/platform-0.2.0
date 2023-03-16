import { DocRef } from '..';
import { Automerge, Crdt, expect, rx, t, Test } from '../../test.ui';

export default Test.describe('DocRef', (e) => {
  type D = { count: number; name?: string };

  e.it('exposed from root API: Crdt.Doc.ref', (e) => {
    expect(Crdt.Doc.DocRef).to.equal(DocRef);
    expect(Crdt.Doc.ref).to.equal(DocRef.init);
  });

  e.describe('initialize', (e) => {
    e.it('kind', (e) => {
      const doc = DocRef.init<D>({ count: 0 });
      expect(doc.kind).to.eql('Crdt:DocRef');
    });

    e.it('from initial {object}', (e) => {
      const initial = { count: 0 };
      const doc = DocRef.init<D>(initial);
      expect(doc.current).to.eql(initial);
      expect(doc.current).to.not.equal(initial); // NB: initialized as an Automerge document.
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });

    e.it('from initial {Automerge} document', (e) => {
      let initial: D = Automerge.init<D>();
      initial = Automerge.change<D>(initial, (doc) => (doc.count = 999));
      const doc = DocRef.init<D>(initial);
      expect(doc.current).to.eql({ count: 999 });
      expect(doc.current).to.equal(initial);
      expect(Automerge.isAutomerge(doc.current)).to.eql(true);
    });
  });

  e.describe('dispose', (e) => {
    e.it('ref.dispose() method', async (e) => {
      const initial = { count: 0 };
      const doc = DocRef.init<D>(initial);

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
      const doc = DocRef.init<D>({ count: 0 }, { dispose$ });

      expect(doc.isDisposed).to.eql(false);
      dispose();
      expect(doc.isDisposed).to.eql(true);
    });
  });

  e.describe('properties', (e) => {
    e.it('doc.id.actor (actorID - unique within process)', async (e) => {
      const doc1 = DocRef.init<D>({ count: 0 });
      expect(doc1.id.actor).to.eql(Automerge.getActorId(doc1.current));
      expect(doc1.id.actor).to.eql(doc1.id.actor); // NB: no change.
      expect(doc1.id.actor.length).to.greaterThan(10);

      const doc2 = DocRef.init<D>({ count: 0 });
      expect(doc1.id.actor).to.not.eql(doc2.id.actor);

      // NB: new reference from doc-1.
      const doc3 = DocRef.init<D>(Automerge.from<D>(doc1.current));
      expect(doc3.id.actor).to.not.eql(doc1.id.actor); // Share same underlying CRDT document.
    });
  });

  e.describe('change', (e) => {
    const initial: D = { count: 0 };

    e.it('changes and fires update event', (e) => {
      const doc = DocRef.init<D>(initial);
      const fired: t.CrdtDocAction<D>[] = [];
      doc.$.subscribe((e) => fired.push(e));

      doc.change((doc) => (doc.count = 999));
      expect(doc.current).to.eql({ count: 999 });

      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('change');
      expect(fired[0].doc).to.eql({ count: 999 });
    });

    e.it('onChange (via {onChange} option and onChange handler method)', async (e) => {
      const fired1: t.CrdtDocRefChangeHandlerArgs<D>[] = [];

      const doc = DocRef.init<D>(initial, { onChange: (e) => fired1.push(e) });
      expect(fired1.length).to.eql(1); // NB: Initial change at assignment of {initial} object.

      doc.change((doc) => (doc.count = 123));
      expect(fired1.length).to.eql(2);

      const fired2: t.CrdtDocRefChangeHandlerArgs<D>[] = [];
      const handler: t.CrdtDocRefChangeHandler<D> = (e) => fired2.push(e);
      doc.onChange(handler);
      doc.onChange(handler);
      doc.onChange(handler); // NB: Only added once.

      doc.change((doc) => (doc.count = 456));
      expect(fired1.length).to.eql(3);
      expect(fired2.length).to.eql(1);
    });

    e.it('change (and update via [Automerge.applyChanges])', (e) => {
      const changes: Uint8Array[] = [];
      const docRef = DocRef.init<D>(initial, { onChange: (e) => changes.push(e.change) });

      docRef.change((doc) => (doc.count = 999));
      docRef.change((doc) => (doc.name = 'foo'));

      let doc = Automerge.init<D>();
      [doc] = Automerge.applyChanges<D>(doc, changes);

      expect(doc.count).to.eql(999);
      expect(doc.name).to.eql('foo');
    });

    e.it(
      'broadcasts the [Automerge.getLastLocalChange] associated with each [doc.change(d→)] mutation',
      async (e) => {
        const doc = DocRef.init<D>(initial);
        const fired: t.CrdtDocAction<D>[] = [];
        doc.$.subscribe((e) => fired.push(e));

        doc.change((doc) => (doc.count = 999));
        expect(fired.length).to.eql(1);

        const event = fired[0] as t.CrdtDocChange<D>;
        expect(event.action).to.eql('change');
        expect(event.change).to.eql(Automerge.getLastLocalChange(doc.current));
      },
    );
  });

  e.describe('replace', (e) => {
    e.it('replaces and fires update event', (e) => {
      const doc = DocRef.init<D>({ count: 0 });
      const fired: t.CrdtDocAction<D>[] = [];
      doc.$.subscribe((e) => fired.push(e));

      const changed = Automerge.change(doc.current, (doc) => (doc.count = 999));
      doc.replace(changed);
      expect(doc.current).to.eql({ count: 999 });

      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('replace');
      expect(fired[0].doc).to.equal(doc.current);
    });

    e.it('throw: not an Automerge document', (e) => {
      const doc = DocRef.init<D>({ count: 0 });
      const fn = () => doc.replace({ count: 123 });
      expect(fn).to.throw(/Cannot replace with a non-Automerge document/);
    });
  });
});
