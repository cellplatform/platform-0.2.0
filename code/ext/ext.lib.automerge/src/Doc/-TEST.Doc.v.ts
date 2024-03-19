import { Doc } from '.';
import { A, Id, describe, expect, it, toObject, type t } from '../test';
import { testSetup, type D } from './-TEST.u';

describe('Doc', async () => {
  const { store, factory } = testSetup();

  describe('document', () => {
    it('create', async () => {
      const doc = await factory();
      expect(Id.Is.slug(doc.instance)).to.eql(true);
      expect(doc.uri).to.eql((doc as t.DocRefHandle<D>).handle.url);
      expect(doc.toObject()).to.eql(doc.current);
      expect(doc.is.ready).to.eql(true);
      expect(doc.is.deleted).to.eql(false);
    });

    it('change', async () => {
      const doc1 = await factory();
      const doc2 = await factory();
      doc2.change((d) => (d.count += 5));

      expect(doc1.instance).to.not.eql(doc2.instance);
      expect(doc1.current.count).to.eql(0);
      expect(doc2.current.count).to.eql(5);
    });

    it('toObject ← POJO', async () => {
      const doc = await factory();
      expect(A.isAutomerge(doc.current)).to.eql(true);
      expect(A.isAutomerge(doc.toObject())).to.eql(false);
      expect(doc.toObject()).to.eql({ count: 0 });
      expect(toObject(doc.current)).to.eql(doc.toObject());
    });
  });

  describe('Doc.heads', () => {
    it('initial head', async () => {
      const doc = await factory();
      const heads = Doc.heads(doc);
      const history = Doc.history(doc);
      expect(heads).to.eql([history.latest.change.hash]);
    });

    it('heads after change', async () => {
      const doc = await factory();
      const heads1 = Doc.heads(doc);

      doc.change((d) => (d.count += 1));
      const heads2 = Doc.heads(doc);
      expect(heads1).to.not.eql(heads2);

      const commits = Doc.history(doc).commits;
      expect(heads1).to.eql([commits[1].change.hash]);
      expect(heads2).to.eql([commits[2].change.hash]);
    });
  });

  it('|test.dispose|', () => store.dispose());
});
