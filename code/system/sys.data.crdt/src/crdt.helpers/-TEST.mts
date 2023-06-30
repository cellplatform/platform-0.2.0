import { CrdtIs, fieldAs } from '.';
import { Crdt } from '../crdt';
import { CrdtDoc } from '../crdt.Doc';
import { Automerge, Diff, expect, rx, t, Test, TestFilesystem } from '../test.ui';

export default Test.describe('crdt helpers', (e) => {
  const docid = 'my-id';

  e.describe('Is (flags)', (e) => {
    type D = { count: number; name?: string; child?: { msg?: string } };
    const Is = CrdtIs;

    e.it('exposed from API root', (e) => {
      expect(Crdt.Is).to.equal(CrdtIs);
    });

    e.it('Is.ref (DocRef)', (e) => {
      const doc = CrdtDoc.ref<D>(docid, { count: 1 });
      expect(Is.ref(doc)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.ref(d)).to.eql(false);
      });
    });

    e.it('Is.file (DocFile)', async (e) => {
      const doc = CrdtDoc.ref<D>(docid, { count: 1 });
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, doc);
      expect(Is.file(file)).to.eql(true);
      expect(Is.file(doc)).to.eql(false);

      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.file(d)).to.eql(false);
      });
    });

    e.it('Is.docSync', (e) => {
      const bus = rx.bus();
      const doc = Crdt.Doc.ref<D>(docid, { count: 1 });
      const sync = CrdtDoc.sync<D>(bus, doc);
      expect(Is.sync(sync)).to.eql(true);
      expect(Is.sync(sync.doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.sync(d)).to.eql(false);
      });
    });

    e.it('Is.lens', (e) => {
      const doc = Crdt.Doc.ref<D>(docid, { count: 1 });
      const lens = Crdt.lens(doc, (d) => d.child ?? (d.child = {}));
      expect(Is.lens(lens)).to.eql(true);
      expect(Is.lens(doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.lens(d)).to.eql(false);
      });
    });

    e.it('Is.text', (e) => {
      const text = new Automerge.Text();
      expect(Is.text(text)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.text(d)).to.eql(false);
      });
    });

    e.it('Is.counter', (e) => {
      const counter = new Automerge.Counter();
      expect(Is.counter(counter)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.counter(d)).to.eql(false);
      });
    });

    e.it('Is.funcData', (e) => {
      const data: t.CrdtFuncData = {
        count: new Automerge.Counter(),
        params: {},
      };
      expect(Is.funcData(data)).to.eql(true);
      expect(Is.funcData({ count: 0, params: {} })).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((d) => {
        expect(Is.funcData(d)).to.eql(false);
      });
    });
  });

  e.describe('fieldAs', (e) => {
    e.it('exposed from API root', (e) => {
      expect(Crdt.fieldAs).to.equal(fieldAs);
    });

    e.it('type: Automerge.Text', (e) => {
      type D = { msg?: t.AutomergeText; count: number };

      const doc1 = CrdtDoc.ref<D>(docid, { count: 0 });
      const doc2 = CrdtDoc.ref<D>(docid, { count: 0, msg: new Automerge.Text() });

      const res1 = fieldAs(doc1.current, 'msg').textType;
      const res2 = fieldAs(doc2.current, 'msg').textType;
      const res3 = fieldAs(doc2.current, 'count').textType;

      expect(res1).to.eql(undefined);
      expect((res2 as any) instanceof Automerge.Text).to.eql(true);
      expect(res3).to.eql(undefined);
    });

    e.it('type: Automerge.Counter', (e) => {
      type D = { count?: t.AutomergeCounter; total?: number };

      const doc1 = CrdtDoc.ref<D>(docid, {});
      const doc2 = CrdtDoc.ref<D>(docid, { count: new Automerge.Counter(), total: 0 });

      const res1 = fieldAs(doc1.current, 'count').counterType;
      const res2 = fieldAs(doc2.current, 'count').counterType;
      const res3 = fieldAs(doc2.current, 'total').counterType;

      expect(res1).to.eql(undefined);
      expect((res2 as any) instanceof Automerge.Counter).to.eql(true);
      expect(res3).to.eql(undefined);
    });
  });

  e.describe('toObject', (e) => {
    type D = { count: number; child?: { msg: string } };

    e.it('toObject(<DocRef>)', (e) => {
      const docRef = CrdtDoc.ref<D>(docid, { count: 1 });
      const res = Crdt.toObject(docRef);

      expect(Automerge.isAutomerge(docRef.current)).to.eql(true);
      expect(Automerge.isAutomerge(res)).to.eql(false);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(docRef.current);
      expect(res).to.not.equal(docRef.current);
    });

    e.it('toObject(<DocFile>)', async (e) => {
      const doc = Crdt.Doc.ref<D>(docid, { count: 1 });
      const file = await Crdt.Doc.file<D>(TestFilesystem.memory().fs, doc);
      const res = Crdt.toObject(file);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(file.doc.current);
      expect(res).to.not.equal(file.doc.current);
    });

    e.it('toObject(<SyncFile>)', (e) => {
      const bus = rx.bus();
      const doc = Crdt.Doc.ref<D>(docid, { count: 1 });
      const sync = CrdtDoc.sync<D>(bus, doc);
      const res = Crdt.toObject(sync);
      expect(res).to.eql({ count: 1 });
      expect(res).to.eql(sync.doc.current);
      expect(res).to.not.equal(sync.doc.current);
    });

    e.it('toObject(<Lens>)', (e) => {
      const doc = Crdt.Doc.ref<D>(docid, { count: 1 });
      const lens = Crdt.lens(doc, (d) => d.child ?? (d.child = { msg: 'foo' }));
      const res = Crdt.toObject(lens);
      expect(res).to.eql({ msg: 'foo' });
      expect(res).to.eql(lens.current);
      expect(res).to.not.equal(lens.root.current.child);
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
      expect(text.toString()).to.eql('');
      expect(Crdt.Is.text(text)).to.eql(true);
    });

    e.it('init: initial value', (e) => {
      const text = Crdt.Text.init('hello');
      expect(text.toString()).to.eql('hello');
    });

    e.it('init: Crdt.text()', (e) => {
      const text = Crdt.text();
      expect(text.toString()).to.eql('');
      expect(Crdt.Is.text(text)).to.eql(true);
    });

    e.describe('update (diffs)', (e) => {
      e.it('no change', (e) => {
        const text = Crdt.text('hello');
        const diff = Diff.chars(text.toString(), 'hello');
        expect(diff[0].kind).to.eql('Unchanged');

        expect(text.toString()).to.eql('hello');
        Crdt.Text.update(text, diff);
        expect(text.toString()).to.eql('hello'); // NB: no change.
      });

      e.it('add text', (e) => {
        const text = Crdt.text();
        const diff = Diff.chars(text.toString(), 'hello');

        expect(text.toString()).to.eql('');
        Crdt.Text.update(text, diff);
        expect(text.toString()).to.eql('hello');
      });

      e.it('delete text', (e) => {
        const initial = 'hello world!';
        const text = Crdt.text(initial);
        const diff = Diff.chars(initial, 'hello');

        Crdt.Text.update(text, diff);
        expect(text.toString()).to.eql('hello');
      });

      e.it('delete text (within doc)', (e) => {
        type D = { text: t.AutomergeText };
        const initial = 'hello world!';
        const doc = Crdt.Doc.ref<D>(docid, { text: Crdt.text(initial) });
        expect(doc.current.text.toString()).to.eql(initial);

        const diff = Diff.chars(initial, 'hello');
        doc.change((d) => Crdt.Text.update(d.text, diff));
        expect(doc.current.text?.toString()).to.eql('hello');
      });
    });
  });
});
