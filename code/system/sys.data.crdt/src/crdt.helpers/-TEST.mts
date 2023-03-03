import { CrdtIs, fieldAs } from '.';
import { Crdt } from '../crdt';
import { CrdtDoc } from '../crdt.Doc';
import { expect, Automerge, t, Test, TestFilesystem } from '../test.ui';

export default Test.describe('crdt helpers', (e) => {
  e.describe('is (flags)', (e) => {
    type D = { count: number; name?: string };
    const is = CrdtIs;

    e.it('exposed from API root', (e) => {
      expect(Crdt.is).to.equal(CrdtIs);
    });

    e.it('is.ref (DocRef)', (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      expect(is.ref(doc)).to.eql(true);
      [null, undefined, {}, [], 0, true, 'a'].forEach((doc) => expect(is.ref(doc)).to.eql(false));
    });

    e.it('is.file (DocFile)', async (e) => {
      const doc = CrdtDoc.ref<D>({ count: 1 });
      const filedir = TestFilesystem.memory().fs;
      const file = await CrdtDoc.file<D>(filedir, { count: 0 });
      expect(is.file(file)).to.eql(true);
      expect(is.file(doc)).to.eql(false);
      [null, undefined, {}, [], 0, true, 'a'].forEach((doc) => expect(is.file(doc)).to.eql(false));
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
});
