import { Store } from '../Store';
import { A, Id, Is, describe, expect, expectError, it, type t } from '../test';

type D = { count?: t.A.Counter; msg?: string };

describe('Store (base)', async () => {
  const FAIL_URI = 'automerge:2eE9k3p2iGcsHkpKy6t1jivjDeXJ';
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  const { store, initial, generator } = testSetup();

  describe('store.doc', () => {
    it('create and change', async () => {
      const doc1 = await generator();
      const doc2 = await generator();
      doc2.change((d) => d.count?.increment(5));

      expect(doc1.instance).to.not.eql(doc2.instance);
      expect(doc1.current.count?.value).to.eql(0);
      expect(doc2.current.count?.value).to.eql(5);
    });

    it('doc', async () => {
      const doc = await generator();
      expect(Id.Is.slug(doc.instance)).to.eql(true);
      expect(doc.uri).to.eql((doc as t.DocRefHandle<D>).handle.url);
      expect(doc.toObject()).to.eql(doc.current);
      expect(doc.is.ready).to.eql(true);
      expect(doc.is.deleted).to.eql(false);
    });

    it('toObject ← POJO', async () => {
      const doc = await generator();
      expect(A.isAutomerge(doc.current)).to.eql(true);
      expect(A.isAutomerge(doc.toObject())).to.eql(false);
      expect(doc.toObject()).to.eql({ count: { value: 0 } });
    });

    describe('store.doc.exists', () => {
      it('exists: true', async () => {
        const store = Store.init();
        const doc = await store.doc.getOrCreate<D>(initial);
        const exists = await store.doc.exists(doc.uri);
        expect(exists).to.eql(true);
        store.dispose();
      });

      it('exists: false (404)', async () => {
        const store = Store.init();
        const test = async (uri: any, expected: boolean) => {
          const exists = await store.doc.exists(uri, { timeout: 10 });
          expect(exists).to.eql(expected, uri);
        };

        for (const uri of ['404', true, null, undefined, [], {}]) {
          await test(uri, false);
        }

        expect(Is.automergeUrl(FAIL_URI)).to.eql(true); // NB: ensure we test for a non-existent document, not a malformed URI.
        await test(FAIL_URI, false);

        store.dispose();
      });

      it('exists: false (deleted)', async () => {
        const store = Store.init();
        const doc = await store.doc.getOrCreate<D>(initial);
        expect(doc.is.deleted).to.eql(false);

        const test = async (expected: boolean) => {
          const exists = await store.doc.exists(doc.uri);
          expect(exists).to.eql(expected, doc.uri);
        };

        await test(true);
        await store.doc.delete(doc.uri);
        expect(doc.is.deleted).to.eql(true);
        await test(false);

        store.dispose();
      });
    });

    describe('store.doc.get', () => {
      it('get: success (document)', async () => {
        const store = Store.init();

        const doc1 = await store.doc.getOrCreate<D>(initial);
        const doc2 = await store.doc.get<D>(doc1.uri);
        const doc3 = await store.doc.get<D>(undefined);

        expect(doc1.is.ready).to.eql(true);
        expect(doc1.uri).to.eql(doc2?.uri);
        expect(doc2?.current).to.eql(doc1.current);
        expect(doc3).to.eql(undefined);

        store.dispose();
      });

      it('get: undefined (not found)', async () => {
        const store = Store.init();
        const doc = await store.doc.get<D>(FAIL_URI, { timeout: 30 });
        expect(doc).to.eql(undefined);
        store.dispose();
      });
    });

    describe('store.doc.getOrCreate', () => {
      it('"ready" by default', async () => {
        const doc = await store.doc.getOrCreate(initial);
        expect((doc as t.DocRefHandle<D>).handle.state).to.eql('ready');
        expect(doc.is.ready).to.eql(true);
        expect(doc.is.deleted).to.eql(false);
        store.dispose();
      });

      it('throw: bad URI times out', async () => {
        expect(Is.automergeUrl(FAIL_URI)).to.eql(true); // NB: make sure we are testing a valid, but non-existent URI.

        const timeout = 30;
        const err = 'Failed to retrieve document for the given URI';
        const fn = () => store.doc.getOrCreate(initial, FAIL_URI, { timeout });
        await expectError(fn, err);

        store.dispose();
      });
    });

    describe('store.doc.factory (generator)', () => {
      it('different documents (generate)', async () => {
        const doc1 = await generator();
        const doc2 = await generator();
        expect(doc1.uri).to.not.eql(doc2.uri);
      });

      it('same document (find via DocUri)', async () => {
        const doc1 = await generator();
        const doc2 = await generator(doc1.uri);
        expect(doc1.uri).to.eql(doc2.uri);
      });

      it('same document (find via DocUri as string)', async () => {
        const doc1 = await generator();
        const doc2 = await generator(`${doc1.uri}`);
        expect(doc1.uri).to.eql(doc2.uri);
      });
    });

    describe('store.doc.delete', () => {
      it('no URI ← false', async () => {
        const res = await store.doc.delete(undefined, { timeout: 10 });
        expect(res).to.eql(false);
      });

      it('delete ← true (success)', async () => {
        const doc = await generator();
        expect(doc.is.deleted).to.eql(false);
        expect(doc.is.ready).to.eql(true);

        const res = await store.doc.delete(doc.uri);
        expect(res).to.eql(true);
        expect(doc.is.deleted).to.eql(true);
        expect(doc.is.ready).to.eql(false);
      });

      it('delete ← false (404, does not exist)', async () => {
        const doc = await generator();
        expect(doc.is.deleted).to.eql(false);

        const uri = 'automerge:3Y6RQm4fUWc6Pt6SS3iShhbGcZBJ'; // NB: does not exist.
        const res = await store.doc.delete(uri, { timeout: 10 });
        expect(res).to.eql(false);
        expect(doc.is.deleted).to.eql(false); // Still not deleted (ie. the URI above had nothing to do with the document).
      });
    });
  });

  it('|test.dispose|', () => store.dispose());
});
