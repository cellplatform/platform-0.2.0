import { Doc, Store, Time, describe, expect, it, type t } from '../test';
import { Shared } from './Shared';
import { listenToIndex } from './Shared.b.listenToIndex';
import { listenToShared } from './Shared.b.listenToShared';

describe('Webrtc: Shared', () => {
  describe('Shared', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await Shared.getOrCreate(store);
      expect(doc.current.docs).to.eql({});
      expect(doc.current['.meta'].ephemeral).to.eql(true);

      const meta = Doc.Meta.get(doc.current);
      expect(meta?.ephemeral).to.eql(true);
      expect(meta?.type?.name).to.eql(Shared.type.name);

      store.dispose();
    });

    it('new docs auto-added to index', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      expect(index.total()).to.eql(0);

      const doc = await Shared.getOrCreate(store);

      await Time.wait(0);
      expect(index.total()).to.eql(1);
      expect(index.doc.current.docs[0].uri).to.eql(doc.uri);
    });

    it('purge', async () => {
      const store = Store.init();
      const index = await Store.index(store);

      expect(index.total()).to.eql(0);
      const doc = await Shared.getOrCreate(store);

      await Time.wait(0);
      expect(index.total()).to.eql(1);

      const res = Shared.purge(index);
      expect(index.total()).to.eql(0);
      expect(res).to.eql([doc.uri]);

      store.dispose();
    });
  });

  describe('Shared.Patches', () => {
    const setup = async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await Shared.getOrCreate(store);

      const events = {
        doc: doc.events(),
        index: index.events(),
      } as const;

      const fired: t.DocChanged<t.CrdtShared>[] = [];
      events.doc.changed$.subscribe((e) => fired.push(e));

      return { store, index, doc, events, fired };
    };

    it('Patches.shared', async () => {
      const { store, doc, fired } = await setup();

      const uri = 'automerge:foo';
      doc.change((d) => (d.docs[uri] = { current: true, version: 1 }));
      doc.change((d) => (d.docs[uri] = { current: false, version: 2 }));
      doc.change((d) => delete d.docs[uri]);

      const res1 = Shared.Patches.shared(fired[0]);
      const res2 = Shared.Patches.shared(fired[1]);
      const res3 = Shared.Patches.shared(fired[2]);

      expect(res1?.uri).to.eql(uri);
      expect(res1?.shared).to.eql(true);
      expect(res1?.version).to.eql(1);

      expect(res2?.uri).to.eql(uri);
      expect(res2?.shared).to.eql(false);
      expect(res2?.version).to.eql(2);

      expect(res3).to.eql(undefined);
      store.dispose();
    });
  });

  describe('Shared.Sync', () => {
    it('Sync.listenToIndex: add → rename → remove', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const shared = await Shared.getOrCreate(store);

      listenToIndex(index, shared);
      expect(shared.current.docs).to.eql({});

      const uri = 'automerge:foo';
      await index.add({ uri });
      expect(shared.current.docs).to.eql({}); // NB: not yet shared.

      // Share.
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[1], { shared: true }));
      expect(shared.current.docs[uri]).to.eql({ current: true, version: 1 }); // NB: entry now exists on the shared-doc.

      // Remove.
      index.remove(uri);
      expect(shared.current.docs[uri].current).to.eql(false);
      expect(shared.current.docs[uri].version).to.eql(2);
      store.dispose();
    });

    it('Sync.listenToShared', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const shared = await Shared.getOrCreate(store);
      const get = (uri: string) => shared.current.docs[uri];

      await Time.wait(0);
      listenToShared(shared, index);
      expect(shared.current.docs).to.eql({});

      const uri = 'automerge:foo';
      shared.change((d) => (d.docs[uri] = { current: false, version: 0 }));

      expect(get(uri)).to.eql({ current: false, version: 0 });
      shared.change((d) => (d.docs[uri] = { current: true, version: 1 }));
      expect(get(uri)).to.eql({ current: true, version: 1 });

      store.dispose();
    });

    it('Sync.indexToShared (all items from pre-existing [Index])', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await Shared.getOrCreate(store);

      await index.add({ uri: 'automerge:a' }); // Not shared.
      await index.add({ uri: 'automerge:b' });
      await index.add({ uri: 'automerge:c' });

      index.doc.change((d) => (d.docs[2].name = 'hello'));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[2], { shared: true }));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[3], { shared: true }));

      // Ensure the syncer updated the doc.
      Shared.Sync.indexToShared(index, doc);
      const shared = doc.current.docs;
      expect(shared['automerge:a']).to.eql(undefined);
      expect(shared['automerge:b']).to.eql({ current: true, version: 1 });
      expect(shared['automerge:c']).to.eql({ current: true, version: 1 });

      store.dispose();
    });

    it.skip('Sync.sharedToIndex', async () => {
      // Shared.Sync.sharedToIndex;
    });
  });
});
