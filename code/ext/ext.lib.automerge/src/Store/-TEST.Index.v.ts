import { Store } from '.';
import { rx, A, describe, expect, expectError, it, type t } from '../test';

type D = { count?: t.A.Counter };

describe('StoreIndex', async () => {
  const testSetup = () => {
    const store = Store.init();
    const initial: t.ImmutableNext<D> = (d) => (d.count = new A.Counter(0));
    const generator = store.doc.factory<D>(initial);
    return { store, initial, generator } as const;
  };

  describe('initialize', () => {
    it('defaults', async () => {
      const { store } = testSetup();
      const index = await Store.Index.init(store);

      expect(index.kind === 'store:index').to.eql(true);
      expect(index.store).to.equal(store);
      expect(index.doc.current.docs).to.eql([]);
      expect(index.total).to.eql(0);

      store.dispose();
    });

    it('lifecycle: init → dispose', async () => {
      const { store } = testSetup();
      const indexA = await Store.Index.init(store);
      const indexB = await Store.Index.init(store, indexA.doc.uri);

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
      const { store } = testSetup();
      const index1 = await Store.Index.init(store);
      const index2 = await Store.Index.init(store, index1.doc.uri);
      const index3 = await Store.Index.init(store);
      expect(index1.doc.uri).to.eql(index2.doc.uri);
      expect(index1.doc.uri).to.not.eql(index3.doc.uri);
      store.dispose();
    });

    it('throw: retrieve non-existent URI', async () => {
      const { store } = testSetup();
      await expectError(
        () => Store.Index.init(store, 'automerge:404'),
        'Failed to retrieve document for the given URI',
      );
      store.dispose();
    });
  });

  describe('auto sync with repo', () => {
    it('new documents automatically added to index', async () => {
      const { store, initial } = testSetup();
      const index = await Store.Index.init(store);
      expect(index.doc.current.docs.length).to.eql(0);
      expect(index.total).to.eql(0);

      const sample = await store.doc.getOrCreate(initial);
      expect(index.doc.current.docs[0].uri).to.eql(sample.uri);
      expect(index.exists(sample.uri)).to.eql(true);
      expect(index.total).to.eql(1);

      store.dispose();
    });

    it('deleted documents automatically removed from index', async () => {
      const { store, initial } = testSetup();
      const index = await Store.Index.init(store);

      const sample = await store.doc.getOrCreate(initial);
      expect(index.doc.current.docs[0].uri).to.eql(sample.uri);
      expect(index.exists(sample.uri)).to.eql(true);
      expect(index.total).to.eql(1);

      store.repo.delete(sample.uri);
      expect(index.doc.current.docs).to.eql([]);
      expect(index.total).to.eql(0);
      expect(index.exists(sample.uri)).to.eql(false);

      store.dispose();
    });
  });

  describe('events', () => {
    describe('lifecycle', () => {
      it('dispose (method)', async () => {
        const { store } = testSetup();
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
        const { store } = testSetup();
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
        const { store } = testSetup();
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
        const base = testSetup();
        const index = await Store.Index.init(base.store);
        const events = index.events();
        return { ...base, index, events } as const;
      };

      it('changed$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.DocChanged<t.RepoIndex>[] = [];
        events.changed$.subscribe((e) => fired.push(e));

        index.add('automerge:foobar');
        expect(fired.length).to.eql(1);
        expect(fired[0].doc.docs[0].uri).to.eql('automerge:foobar');

        store.dispose();
      });

      it('added$', async () => {
        const { store, events, index } = await eventsSetup();
        const fired: t.StoreIndexAdded[] = [];
        events.added$.subscribe((e) => fired.push(e));

        index.add('automerge:foo');
        index.add('automerge:bar');

        expect(fired.length).to.eql(2);
        expect(fired[0].index).to.eql(0);
        expect(fired[1].index).to.eql(1);
        expect(fired[0].item.uri).to.eql('automerge:foo');
        expect(fired[1].item.uri).to.eql('automerge:bar');

        store.dispose();
      });
    });
  });
});
