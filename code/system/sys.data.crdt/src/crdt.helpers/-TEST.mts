import { CrdtIs, fieldAs } from '.';
import { Crdt } from '../crdt';
import { CrdtDoc } from '../crdt.Doc';
import { Automerge, expect, rx, t, Test, TestFilesystem } from '../test.ui';

export default Test.describe('crdt helpers', (e) => {
  e.describe('Is (flags)', (e) => {
    type D = { count: number; name?: string };
    const Is = CrdtIs;

    e.it('exposed from API root', (e) => {
      expect(Crdt.Is).to.equal(CrdtIs);
    });

    e.it('Is.ref (DocRef)', (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      expect(Is.ref(doc)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.ref(d)).to.eql(false);
      });
    });

    e.it('Is.file (DocFile)', async (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, { count: 0 });
      expect(Is.file(file)).to.eql(true);
      expect(Is.file(doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.file(d)).to.eql(false);
      });
    });

    e.it('Is.docSync', (e) => {
      const bus = rx.bus();
      const sync = CrdtDoc.sync<D>(bus, { count: 0 });
      expect(Is.sync(sync)).to.eql(true);
      expect(Is.sync(sync.doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.sync(d)).to.eql(false);
      });
    });

    e.it('Is.text', (e) => {
      const text = new Automerge.Text();
      expect(Is.text(text)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.text(d)).to.eql(false);
      });
    });
  });

  e.describe('fieldAs', (e) => {
    e.it('exposed from API root', (e) => {
      expect(Crdt.fieldAs).to.equal(fieldAs);
    });

    e.it('type: Automerge.Text', (e) => {
      type D = { msg?: t.AutomergeText; count: number };

      const doc1 = CrdtDoc.ref<D>({ count: 0 });
      const doc2 = CrdtDoc.ref<D>({ count: 0, msg: new Automerge.Text() });

      const res1 = fieldAs(doc1.current, 'msg').textType;
      const res2 = fieldAs(doc2.current, 'msg').textType;
      const res3 = fieldAs(doc2.current, 'count').textType;

      expect(res1).to.eql(undefined);
      expect(res2 instanceof Automerge.Text).to.eql(true);
      expect(res3).to.eql(undefined);
    });

    e.it('type: Automerge.Counter', (e) => {
      type D = { count?: t.AutomergeCounter; total?: number };

      const doc1 = CrdtDoc.ref<D>({});
      const doc2 = CrdtDoc.ref<D>({ count: new Automerge.Counter(), total: 0 });

      const res1 = fieldAs(doc1.current, 'count').counterType;
      const res2 = fieldAs(doc2.current, 'count').counterType;
      const res3 = fieldAs(doc2.current, 'total').counterType;

      expect(res1).to.eql(undefined);
      expect(res2 instanceof Automerge.Counter).to.eql(true);
      expect(res3).to.eql(undefined);
    });
  });

  e.describe('toObject', (e) => {
    type D = { count: number; child?: { msg: string } };

    e.it('toObject(<DocRef>)', (e) => {
      const docRef = CrdtDoc.ref<D>({ count: 1 });
      const res = Crdt.toObject(docRef);

      expect(Automerge.isAutomerge(docRef.current)).to.eql(true);
      expect(Automerge.isAutomerge(res)).to.eql(false);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(docRef.current);
      expect(res).to.not.equal(docRef.current);
    });

    e.it('toObject(<DocFile>)', async (e) => {
      const file = await Crdt.Doc.file<D>(TestFilesystem.memory().fs, { count: 1 });
      const res = Crdt.toObject(file);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(file.doc.current);
      expect(res).to.not.equal(file.doc.current);
    });

    e.it('toObject(<SyncFile>)', async (e) => {
      const bus = rx.bus();
      const sync = CrdtDoc.sync<D>(bus, { count: 1 });
      const res = Crdt.toObject(sync);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(sync.doc.current);
      expect(res).to.not.equal(sync.doc.current);
    });

    e.it('toObject(<Automerge Doc>)', async (e) => {
      let doc = Automerge.init<D>();
      doc = Automerge.change<D>(doc, (doc) => {
        doc.count = 5;
        doc.child = { msg: 'hello' };
      });

      const res1 = Crdt.toObject(doc);
      const res2 = Crdt.toObject(doc.child ?? {});

      expect(Automerge.isAutomerge(res1)).to.eql(false);
      expect(Automerge.isAutomerge(res2)).to.eql(false);

      expect(res1).to.eql({ count: 5, child: { msg: 'hello' } });
      expect(res1).to.not.equal(doc);

      expect(res2).to.eql({ msg: 'hello' });
      expect(res2).to.not.equal(doc.child);
    });

    e.it('simple objects', async (e) => {
      const obj = { count: 1, child: { msg: 'hello' } };

      const res1 = Crdt.toObject({});
      const res2 = Crdt.toObject(obj);
      const res3 = Crdt.toObject(obj.child);
      expect(res1).to.eql({});
      expect(res2).to.eql(obj);
      expect(res3).to.eql(obj.child);
    });

    e.it('throw error', (e) => {
      const test = (input: any) => {
        const fn = () => Crdt.toObject(input);
        expect(fn).to.throw(/Unable to convert/);
      };
      [null, undefined, 1, true, 'a', []].forEach((value) => test(value));
    });
  });

  e.describe('Text', (e) => {
    e.it('init', (e) => {
      const text = Crdt.Text.init();
      expect(Crdt.Is.text(text)).to.eql(true);
    });
  });
});
