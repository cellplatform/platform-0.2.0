import { Store } from '../Store';
import { A, Id, Is, describe, expect, expectError, it, rx, type t } from '../test';

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
      expect(doc.uri).to.eql(doc.handle.url);
      expect(doc.toObject()).to.eql(doc.current);
    });

    it('toObject ← POJO', async () => {
      const doc = await generator();
      expect(A.isAutomerge(doc.current)).to.eql(true);
      expect(A.isAutomerge(doc.toObject())).to.eql(false);
      expect(doc.toObject()).to.eql({ count: { value: 0 } });
    });

    describe('existence', () => {
      it('exists: false', async () => {
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

      it('exists:true', async () => {
        const store = Store.init();
        const doc = await store.doc.getOrCreate<D>(initial);
        const exists = await store.doc.exists(doc.uri);
        expect(exists).to.eql(true);
        store.dispose();
      });
    });

    describe('get', () => {
      it('get: success (document)', async () => {
        const store = Store.init();

        const doc1 = await store.doc.getOrCreate<D>(initial);
        const doc2 = await store.doc.get<D>(doc1.uri);
        const doc3 = await store.doc.get<D>(undefined);

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

    describe('getOrCreate', () => {
      it('"ready" by default', async () => {
        const doc = await store.doc.getOrCreate(initial);
        expect(doc.handle.state).to.eql('ready');
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

    describe('factory (generator)', () => {
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
  });

  describe('store.doc.events', () => {
    describe('lifecycle', async () => {
      it('multiple instances', async () => {
        const doc = await generator();
        const events1 = doc.events();
        const events2 = doc.events();
        expect(events1).to.not.equal(events2);
      });

      describe('dispose', () => {
        it('via .dispose()', async () => {
          const doc = await generator();
          const events = doc.events();
          let fired = 0;
          events.dispose$.subscribe(() => fired++);

          expect(events.disposed).to.eql(false);
          events.dispose();
          events.dispose();
          expect(events.disposed).to.eql(true);
          expect(fired).to.eql(1);
        });

        it('via { dispose$ }', async () => {
          const doc = await generator();
          const dispose$ = new rx.Subject<void>();
          const events = doc.events(dispose$);

          let fired = 0;
          events.dispose$.subscribe(() => fired++);

          expect(events.disposed).to.eql(false);
          dispose$.next();
          dispose$.next();
          expect(events.disposed).to.eql(true);
          expect(fired).to.eql(1);
        });

        it('when parent store is disposed', async () => {
          const { store, generator } = testSetup();
          const doc = await generator();
          const events = doc.events();
          let fired = 0;
          events.dispose$.subscribe(() => fired++);

          expect(store.disposed).to.eql(false);
          expect(events.disposed).to.eql(false);
          store.dispose();

          expect(store.disposed).to.eql(true);
          expect(events.disposed).to.eql(true);
          expect(fired).to.eql(1);
        });
      });
    });

    it('changed$', async () => {
      const doc = await generator();
      const events = doc.events();

      const fired: t.DocChanged<D>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      const increment = () => doc.change((d) => d.count?.increment(1));
      increment();
      expect(doc.current.count?.value).to.eql(1);
      expect(fired.length).to.eql(1);

      const e = fired[0];
      expect(e.uri).to.eql(doc.uri);
      expect(e.doc).to.eql(doc.current);
      expect(e.patches.length).to.eql(1);
      expect(e.patches[0].action).to.eql('inc');
      expect(e.patchInfo.source).to.eql('change');
      expect(e.patchInfo.before.count?.value).to.eql(0);
      expect(e.patchInfo.after.count?.value).to.eql(1);

      events.dispose();
      increment();
      increment();
      expect(fired.length).to.eql(1); // NB: no change after dispose.
    });

    it('changed$: does not fire when value not updated', async () => {
      const doc = await generator();
      const events = doc.events();

      const fired: t.DocChanged<D>[] = [];
      events.changed$.subscribe((e) => fired.push(e));

      doc.change((d) => {}); // NB: no adjustments made
      expect(fired.length).to.eql(0);

      doc.change((d) => (d.msg = 'foo'));
      expect(fired.length).to.eql(1);

      events.dispose();
    });
  });

  it('|test.dispose|', () => store.dispose());
});
