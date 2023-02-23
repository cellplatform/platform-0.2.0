import { CrdtIs } from '.';
import { CrdtDoc } from '../crdt.Doc';
import { expect, Test, TestFilesystem } from '../test.ui';
import { Crdt } from '../crdt';

export default Test.describe('Is (flags)', (e) => {
  type D = { count: number; name?: string };
  const is = CrdtIs;

  e.it('exposed from API root (Crdt.Is)', async (e) => {
    expect(Crdt.Is).to.equal(CrdtIs);
  });

  e.it('is.ref (DocRef)', async (e) => {
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
