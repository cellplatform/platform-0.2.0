import { Store } from '.';
import { A, Id, Is, describe, expect, it, rx, type t, expectError } from '../test';

type D = { count?: t.A.Counter };

describe('Store', async () => {
  const store = Store.init();
  const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
  const generator = store.doc.factory<D>(initial);

  it('Is.store', () => {
    const non = [true, 123, '', [], {}, null, undefined];
    non.forEach((value) => expect(Is.store(value)).to.eql(false));
    expect(Is.store(store)).to.eql(true);
  });

  describe('lifecycle', () => {
    it('dispose', () => {
      const store = Store.init();
      expect(store.disposed).to.eql(false);

      let count = 0;
      store.dispose$.subscribe(() => count++);
      store.dispose();
      store.dispose();
      expect(store.disposed).to.eql(true);
      expect(count).to.eql(1);
    });

    it('dispose$', () => {
      const { dispose, dispose$ } = rx.disposable();
      const store = Store.init({ dispose$ });
      expect(store.disposed).to.eql(false);

      let count = 0;
      store.dispose$.subscribe(() => count++);
      dispose();
      expect(store.disposed).to.eql(true);
      expect(count).to.eql(1);
    });

    it('throw if disposed', async () => {
      const store = Store.init();
      store.dispose();

      const err = 'Store is disposed';
      expectError(async () => store.repo, err);
      expectError(async () => store.doc.findOrCreate<D>(initial), err);
      expectError(async () => store.doc.factory<D>(initial), err);
      expectError(async () => store.doc.exists(), err);
    });
  });

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

    it('toObject (POJO)', async () => {
      const doc = await generator();
      expect(A.isAutomerge(doc.current)).to.eql(true);
      expect(A.isAutomerge(doc.toObject())).to.eql(false);
      expect(doc.toObject()).to.eql({ count: { value: 0 } });
    });

    it('does not exist', () => {
      const store = Store.init();
      ['404', true, null, undefined, [], {}]
        //
        .forEach((uri: any) => expect(store.doc.exists(uri)).to.eql(false));
      const dummy = 'automerge:2eE9k3p2iGcsHkpKy6t1jivjDeXJ';
      expect(Is.automergeUrl(dummy)).to.eql(true);
      expect(store.doc.exists(dummy)).to.eql(false);
    });

    it('does exist', async () => {
      const store = Store.init();
      const doc = await store.doc.findOrCreate<D>(initial);
      expect(store.doc.exists(doc.uri)).to.eql(true);
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
      const doc = await generator();

      it('multiple instances', () => {
        const events1 = doc.events();
        const events2 = doc.events();
        expect(events1).to.not.equal(events2);
      });

      it('findOrCreate: "ready" (default)', async () => {
        const doc = await store.doc.findOrCreate(initial);
        expect(doc.handle.state).to.eql('ready');
      });

      describe('dispose', () => {
        it('via .dispose()', () => {
          const events = doc.events();
          let fired = 0;
          events.dispose$.subscribe(() => fired++);

          expect(events.disposed).to.eql(false);
          events.dispose();
          events.dispose();
          expect(events.disposed).to.eql(true);
          expect(fired).to.eql(1);
        });

        it('via { dispose$ }', () => {
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
      });
    });

    it('changed', async () => {
      const doc = await generator();
      const events = doc.events();

      let fired: t.DocChanged<D>[] = [];
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
  });
});
