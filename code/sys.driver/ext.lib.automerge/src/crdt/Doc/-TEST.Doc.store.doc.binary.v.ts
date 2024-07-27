import { Doc } from '.';
import { A, describe, expect, it, rx, type t } from '../../test';
import { Store } from '../Store';

const Uri = Store.Doc.Uri;

type O = Record<string, unknown>;
type D = { count: number };

describe('Doc: binary ← "hard-coded byte array hack"', async () => {
  const getBinary = () => Store.Doc.toBinary<D>((d) => (d.count = 0));

  describe('Store.Doc: toBinary', () => {
    it('from init function', async () => {
      const store = Store.init();
      const binary = Store.Doc.toBinary<D>((d) => (d.count = 123));
      const doc = store.doc.fromBinary<D>(binary);
      expect(doc.current.count).to.eql(123);
      store.dispose();
    });

    it('from doc', async () => {
      const store = Store.init();
      const doc1 = await store.doc.getOrCreate<D>((d) => (d.count = 888));
      const doc2 = store.doc.fromBinary<D>(Store.Doc.toBinary<D>(doc1));
      expect(doc2.current.count).to.eql(888);
      store.dispose();
    });
  });

  describe('Store.Doc: fromBinary', () => {
    it('from given URI', async () => {
      const store = Store.init();
      const binary = getBinary();
      const uri = Uri.Generate.uri();

      const exists = () => store.doc.exists(uri, { timeout: 30 });
      expect(await exists()).to.eql(false);

      const doc1 = store.doc.fromBinary(binary, { uri });
      const doc2 = store.doc.fromBinary(binary, uri);
      store.dispose();

      expect(doc1.is.ready).to.eql(true);
      expect(doc1.current).to.eql({ count: 0 });
      expect(await exists()).to.eql(true);

      expect(doc1.uri).to.eql(doc2.uri);
      expect(doc1.current).to.eql(doc2.current);
    });

    it('generates URI', async () => {
      const store = Store.init();
      const binary = getBinary();
      const doc = store.doc.fromBinary(binary);
      store.dispose();

      expect(await store.doc.exists(doc.uri, { timeout: 30 })).to.eql(true);
      expect(doc.current).to.eql({ count: 0 });
    });

    it('dispose$', async () => {
      const store = Store.init();
      const binary = getBinary();
      const { dispose, dispose$ } = rx.disposable();

      const doc1 = store.doc.fromBinary(binary, { dispose$ });
      const doc2 = store.doc.fromBinary(binary);
      const doc3 = await store.doc.getOrCreate<D>((d) => (d.count = 123));
      const events1 = doc1.events();
      const events2 = doc2.events();
      const events3 = doc3.events();

      expect(events1.disposed).to.eql(false);
      expect(events2.disposed).to.eql(false);
      expect(events3.disposed).to.eql(false);

      expect(events1.disposed).to.eql(false);
      expect(events2.disposed).to.eql(false);
      expect(events3.disposed).to.eql(false);

      dispose();
      expect(events1.disposed).to.eql(true);
      expect(events2.disposed).to.eql(false);
      expect(events3.disposed).to.eql(false);

      store.dispose();
      expect(events1.disposed).to.eql(true);
      expect(events2.disposed).to.eql(true);
      expect(events3.disposed).to.eql(true);
    });

    it('throw: invalid URI', async () => {
      const store = Store.init();
      const binary = getBinary();
      const fn = () => store.doc.fromBinary(binary, { uri: 'foo' });
      expect(fn).to.throw(/Invalid document URI/);
      store.dispose();
    });

    it('throw: invalid binary', async () => {
      const store = Store.init();
      const fn = () => store.doc.fromBinary(new Uint8Array([1, 2, 3]));
      expect(fn).to.throw(/Invalid document binary/);
      store.dispose();
    });
  });

  describe('mering from same genesis', () => {
    it('merge: uri-A → uri-B', () => {
      const store = Store.init();
      const binary = getBinary();

      // Seperate lineages but from same genesis binary.
      const doc1 = store.doc.fromBinary<D>(binary);
      const doc2 = store.doc.fromBinary<D>(binary);
      expect(doc1.uri).to.not.eql(doc2.uri);

      doc1.change((d) => (d.count = 123));
      expect(doc1.current.count).to.eql(123);
      expect(doc2.current.count).to.eql(0);

      Doc.merge(doc1, doc2);

      expect(doc1.current.count).to.eql(123);
      expect(doc2.current.count).to.eql(123);

      store.dispose();
    });

    it('clone and merge → to target document with new uri', () => {
      const store = Store.init();
      const binary = getBinary();

      // Seperate lineages but from same genesis binary.
      const doc1 = store.doc.fromBinary<D>(binary);
      const doc2 = store.doc.fromBinary<D>(binary);
      expect(doc1.uri).to.not.eql(doc2.uri);

      doc2.change((d) => (d.count = 888));

      function cloneAndMerge<T extends O>(source: t.Doc<T>, target: t.Doc<T>) {
        const doc = store.doc.fromBinary(Doc.toBinary(source), target.uri);
        Doc.merge(target, doc);
        return doc;
      }

      const doc3 = cloneAndMerge(doc1, doc2);
      expect(doc3.uri).to.eql(doc2.uri);
      expect(doc3.current.count).to.eql(888);
    });
  });
});
