import { Store } from '../Store';
import { Doc } from '../Store.Doc';
import { A, Time, describe, expect, expectError, it, rx, type t } from '../test';

type D = { count: number };

describe('StoreIndex', async () => {
  const setup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = 0);
    const generateSample = store.doc.factory<D>(initial);
    return { store, initial, generateSample } as const;
  };

  describe('initialize', () => {
    it('defaults', async () => {
      const { store } = setup();
      const index = await Store.Index.init(store);

      expect(index.kind === 'store:index').to.eql(true);
      expect(index.store).to.equal(store);
      expect(index.doc.current.docs).to.eql([]);
      expect(index.total()).to.eql(0);

      store.dispose();
    });

    it('lifecycle: init → dispose', async () => {
      const { store } = setup();
      const indexA = await Store.Index.init(store);
      const indexB = await Store.Index.init(store, { uri: indexA.doc.uri });

      expect(indexA.doc.uri).to.eql(indexB.doc.uri);
      expect(indexA.doc.current.docs).to.eql([]);

      const events = indexB.doc.events();
      expect(store.disposed).to.eql(false);
      expect(events.disposed).to.eql(false);

      store.dispose();
      expect(store.disposed).to.eql(true);
      expect(events.disposed).to.eql(true);
    });

    it('multiple instances', async () => {
      const { store } = setup();
      const index1 = await Store.Index.init(store);
      const index2 = await Store.Index.init(store, { uri: index1.doc.uri });
      const index3 = await Store.Index.init(store);
      expect(index1.doc.uri).to.eql(index2.doc.uri);
      expect(index1.doc.uri).to.not.eql(index3.doc.uri);
      store.dispose();
    });

    it('total (filter)', async () => {
      const { store, generateSample: generator } = setup();
      const index = await Store.Index.init(store);

      await generator();
      await generator();
      await generator();

      await Time.wait(0);
      expect(index.total()).to.eql(3);

      const filteredTotal = index.total((e) => e.index < 1);
      expect(filteredTotal).to.eql(1);

      store.dispose();
    });

    it('throw: retrieve non-existent URI', async () => {
      const { store } = setup();
      await expectError(
        () => Store.Index.init(store, { uri: 'automerge:404' }),
        'Failed to retrieve document for the given URI',
      );
      store.dispose();
    });
  });

  describe('add / remove / exists', () => {
    it('add', async () => {
      const { store } = setup();
      const index = await Store.index(store);
      expect(index.doc.current.docs).to.eql([]);

      const uri = 'automerge:foo';
      const res1 = await index.add({ uri });
      const res2 = await index.add({ uri });
      const res3 = await index.add([{ uri }, { uri }, { uri }]);
      expect(res1).to.eql(1);
      expect(res2).to.eql(0); // Already added.
      expect(res3).to.eql(0); // Already added.

      store.dispose();
    });

    it('add (with name)', async () => {
      const { store } = setup();
      const index = await Store.index(store);
      expect(index.doc.current.docs).to.eql([]);

      const uri = 'automerge:foo';
      const res1 = await index.add({ uri, name: 'foo' });
      expect(index.doc.current.docs[0].name).to.eql('foo');
      const res2 = await index.add({ uri, name: 'foo' });
      const res3 = await index.add({ uri, name: 'bar' }); // NB: no change, already exists.

      expect(res1).to.eql(1);
      expect(res2).to.eql(0); // Already added.
      expect(res3).to.eql(0);

      store.dispose();
    });

    it('add (many)', async () => {
      const { store } = setup();
      const index = await Store.index(store);
      expect(index.doc.current.docs).to.eql([]);

      const A = 'automerge:a';
      const B = 'automerge:b';
      const C = 'automerge:c';
      const D = 'automerge:d';

      const res1 = await index.add([{ uri: A }, { uri: B }, { uri: C, name: 'foobar' }]);
      const res2 = await index.add([{ uri: A }, { uri: C }]);
      const res3 = await index.add([{ uri: A }, { uri: D }]);

      expect(res1).to.eql(3);
      expect(res2).to.eql(0); // NB: all specified items already exist.
      expect(res3).to.eql(1);

      const docs = index.doc.current.docs;
      expect(docs[0].uri).to.eql(A);
      expect(docs[1].uri).to.eql(B);
      expect(docs[2].uri).to.eql(C);
      expect(docs[2].name).to.eql('foobar');
      expect(docs[3].uri).to.eql(D);

      store.dispose();
    });

    it('add (does not allow duplicates)', async () => {
      const { store } = setup();
      const index = await Store.index(store);
      expect(index.total()).to.eql(0);

      const A = 'automerge:a';
      const B = 'automerge:b';
      const C = 'automerge:c';

      await index.add({ uri: A });
      await index.add({ uri: A });
      expect(index.total()).to.eql(1);

      await index.add([{ uri: A }, { uri: B }, { uri: B }, { uri: B }]);
      expect(index.total()).to.eql(2);

      store.dispose();
    });

    it('exists', async () => {
      const { store } = setup();
      const index = await Store.index(store);

      const A = 'automerge:a';
      const B = 'automerge:b';
      const C = 'automerge:c';

      expect(index.exists(A)).to.eql(false);
      expect(index.exists([A, B, C])).to.eql(false);

      await index.add({ uri: A });
      await index.add({ uri: B });

      expect(index.exists(A)).to.eql(true);
      expect(index.exists([A, B])).to.eql(true);

      expect(index.exists([A, B, C])).to.eql(false);
      expect(index.exists([C])).to.eql(false);
      expect(index.exists([])).to.eql(false);

      store.dispose();
    });

    it.skip('remove', async () => {
      const { store } = setup();
      const index = await Store.index(store);

      const A = 'automerge:a';
      const B = 'automerge:b';
      const C = 'automerge:c';
      await index.add([{ uri: A }, { uri: B }, { uri: B }]);
      expect(index.total()).to.eql(3);

      console.log('index.current', index.doc.current);

      store.dispose();
    });
  });

  describe('method: "add" (auto syncs with repo)', () => {
    it('new documents automatically added to index', async () => {
      const { store, initial } = setup();
      const index = await Store.Index.init(store);
      expect(index.doc.current.docs.length).to.eql(0);
      expect(index.total()).to.eql(0);

      const sample = await store.doc.getOrCreate(initial);
      await Time.wait(0);
      expect(Doc.Meta.exists(sample)).to.eql(false);

      const entry = index.doc.current.docs[0];
      expect(entry.uri).to.eql(sample.uri);
      expect(entry.meta).to.eql(undefined);
      expect(index.exists(sample.uri)).to.eql(true);
      expect(index.total()).to.eql(1);

      store.dispose();
    });

    it('new document with {.meta} data', async () => {
      const { store } = setup();
      const index = await Store.Index.init(store);

      type T = t.DocMeta & { foo: string };
      const meta: T = { ephemeral: true, foo: 'hello' };
      const sample = await store.doc.getOrCreate<D>((d) => {
        d.count = 0;
        Doc.Meta.ensure(d, meta);
      });

      expect(Doc.Meta.exists(sample)).to.eql(true);

      await Time.wait(0);
      const entry = index.doc.current.docs[0];
      expect(entry.meta?.ephemeral).to.eql(true);
      expect((entry.meta as any).foo).to.eql(undefined); // NB: only index relevant meta-data properties copied (non-leaky).

      store.dispose();
    });

    it('deleted documents automatically removed from index', async () => {
      const { store, initial } = setup();
      const index = await Store.Index.init(store);

      const sample = await store.doc.getOrCreate(initial);
      await Time.wait(0);
      expect(index.doc.current.docs[0].uri).to.eql(sample.uri);
      expect(index.exists(sample.uri)).to.eql(true);
      expect(index.total()).to.eql(1);

      store.repo.delete(sample.uri);
      expect(index.doc.current.docs).to.eql([]);
      expect(index.total()).to.eql(0);
      expect(index.exists(sample.uri)).to.eql(false);

      store.dispose();
    });
  });

  describe('events', () => {
    describe('lifecycle', () => {
      it('dispose (method)', async () => {
        const { store } = setup();
        const index = await Store.Index.init(store);
        const events = index.events();
        let fired = 0;
        events.dispose$.subscribe(() => fired++);
        expect(events.disposed).to.eql(false);
        events.dispose();
        events.dispose();
        expect(events.disposed).to.eql(true);
        expect(fired).to.eql(1);
        store.dispose();
      });

      it('dispose (method)', async () => {
        const life = rx.lifecycle();
        const { store } = setup();
        const index = await Store.Index.init(store);
        const events = index.events(life.dispose$);
        let fired = 0;
        events.dispose$.subscribe(() => fired++);
        expect(events.disposed).to.eql(false);

        life.dispose();
        expect(events.disposed).to.eql(true);
        expect(fired).to.eql(1);

        store.dispose();
      });

      it('disposed when store is disposed', async () => {
        const { store } = setup();
        const index = await Store.Index.init(store);
        const events = index.events();
        let fired = 0;
        events.dispose$.subscribe(() => fired++);
        expect(events.disposed).to.eql(false);
        store.dispose();
        expect(events.disposed).to.eql(true);
        expect(fired).to.eql(1);
      });
    });

    describe('fire', () => {
      const eventsSetup = async () => {
        const base = setup();
        const index = await Store.Index.init(base.store);
        const events = index.events();
        return { ...base, index, events } as const;
      };

      it('changed$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.DocChanged<t.RepoIndex>[] = [];
        events.changed$.subscribe((e) => fired.push(e));

        await index.add({ uri: 'automerge:foobar' });
        expect(fired.length).to.eql(1);
        expect(fired[0].doc.docs[0].uri).to.eql('automerge:foobar');

        store.dispose();
      });

      it('added$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.StoreIndexItem[] = [];
        events.added$.subscribe((e) => fired.push(e));

        await index.add({ uri: 'automerge:foo' });
        await index.add({ uri: 'automerge:bar' });

        expect(fired.length).to.eql(2);
        expect(fired[0].index).to.eql(0);
        expect(fired[0].total).to.eql(1);
        expect(fired[0].item.uri).to.eql('automerge:foo');
        expect(fired[1].index).to.eql(1);
        expect(fired[1].total).to.eql(2);
        expect(fired[1].item.uri).to.eql('automerge:bar');

        store.dispose();
      });

      it('removed$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.StoreIndexItem[] = [];
        events.removed$.subscribe((e) => fired.push(e));

        await index.add({ uri: 'automerge:foo' });
        await index.add({ uri: 'automerge:bar' });
        await index.remove('automerge:bar');

        expect(fired.length).to.eql(1);
        expect(fired[0].index).to.eql(1);
        expect(fired[0].total).to.eql(1);
        expect(fired[0].item.uri).to.eql('automerge:bar');

        store.dispose();
      });

      it('shared$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.StoreIndexItem[] = [];
        events.shared$.subscribe((e) => fired.push(e));

        await index.add({ uri: 'automerge:foo' });
        const item = () => index.doc.current.docs[0];
        expect(item().uri).to.eql('automerge:foo');
        expect(item().shared).to.eql(undefined);

        index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 0));
        expect(item().shared?.current).to.eql(true);

        index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 0, { value: true })); // NB: no change.
        expect(item().shared?.current).to.eql(true);

        index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 0)); // NB: explicit value.
        expect(item().shared?.current).to.eql(false);

        expect(fired.length).to.eql(2);
        expect(fired[0].item.shared?.current).to.eql(true);
        expect(fired[1].item.shared?.current).to.eql(false);

        store.dispose();
      });

      it('renamed$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.StoreIndexItem[] = [];
        events.renamed$.subscribe((e) => fired.push(e));

        await index.add({ uri: 'automerge:foo' });
        const item = () => index.doc.current.docs[0];
        expect(item().uri).to.eql('automerge:foo');
        expect(item().name).to.eql(undefined);

        index.doc.change((d) => (d.docs[0].name = 'foo'));
        expect(item().name).to.eql('foo');

        expect(fired.length).to.eql(1);
        expect(fired[0].item.name).to.eql('foo');

        store.dispose();
      });
    });
  });
});
