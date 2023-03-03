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

});
