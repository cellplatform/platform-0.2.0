import { CrdtDoc } from '.';
import { t, expect, Test, TestFilesystem } from '../test.ui';
import { Automerge } from './common';

export default Test.describe('CrdtDoc', (e) => {
  type D = { count: number; name?: string };

  e.describe('DocRef', (e) => {
    e.describe('init', (e) => {
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

    e.describe('properties', (e) => {
      e.it('doc.id.actor (actorId)', async (e) => {
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

  e.describe('DocFile', (e) => {
    const initial: D = { count: 0 };

    e.it('init: does not yet exist in filesystem', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);
      expect(file.doc.current).to.eql(initial);
      expect(await file.exists()).to.eql(false);
    });

    e.it('init: pass in existing [DocRef]', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const doc = CrdtDoc.ref<D>(initial);
      const file = await CrdtDoc.file<D>(filedir, doc);
      expect(file.doc).to.equal(doc);
    });

    e.it('save', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);

      expect(await file.exists()).to.eql(false);
      expect((await filedir.manifest()).files).to.eql([]);

      await file.save();
      const m = await filedir.manifest();

      expect(await file.exists()).to.eql(true);
      expect(m.files.length).to.eql(1);
    });

    e.it('load', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, initial);
      const original = {
        ref: file.doc,
        doc: file.doc.current,
      };

      const fired: t.CrdtDocChange<D>[] = [];
      file.doc.$.subscribe((e) => fired.push(e));

      await file.load();
      expect(await file.exists()).to.eql(false);
      expect(fired).to.eql([]);

      await file.save();
      expect(await file.exists()).to.eql(true);

      await file.load();
      expect(fired.length).to.eql(1);
      expect(fired[0].action).to.eql('replace');

      expect(file.doc).to.equal(original.ref); // NB: Replaces the underlying Automerge doc, not the ref.
      expect(file.doc.current).to.not.equal(original.doc);
      expect(file.doc.current).to.eql(original.doc); // NB: Equivalent but not the same instance.
    });

    e.it('load on init', async (e) => {
      const filedir = TestFilesystem.memory().fs;
      const file1 = await CrdtDoc.file<D>(filedir, initial);

      file1.doc.change((d) => (d.count = 1234));
      await file1.save();

      const file2 = await CrdtDoc.file<D>(filedir, initial);
      expect(file2.doc.current).to.eql({ count: 1234 });
    });
  });

  e.describe('DocIs (flags)', (e) => {
    const is = CrdtDoc.is;

    e.it('is.ref', async (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      expect(is.ref(doc)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((doc) => expect(is.ref(doc)).to.eql(false));
    });

    e.it('is.file', async (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, { count: 0 });
      expect(is.file(file)).to.eql(true);
      expect(is.file(doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((doc) => expect(is.file(doc)).to.eql(false));
    });
  });
});
