import { SyncDoc } from '.';
import { Doc, Store, Time, describe, expect, it, type t } from '../test';
import { listenToIndex } from './SyncDoc.b.listenToIndex';

describe('network.Webrtc', () => {
  describe('SyncDoc', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await SyncDoc.getOrCreate(store);
      expect(doc.current.shared).to.eql({});
      expect(doc.current['.meta'].ephemeral).to.eql(true);

      const meta = Doc.Meta.get(doc.current);
      expect(meta?.ephemeral).to.eql(true);
      expect(meta?.type?.name).to.eql('crdt.webrtc.SyncDoc');

      store.dispose();
    });

    it('new docs auto-added to index', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      expect(index.total()).to.eql(0);

      const doc = await SyncDoc.getOrCreate(store);

      await Time.wait(0);
      expect(index.total()).to.eql(1);
      expect(index.doc.current.docs[0].uri).to.eql(doc.uri);
    });

    it('purge', async () => {
      const store = Store.init();
      const index = await Store.index(store);

      expect(index.total()).to.eql(0);
      const doc = await SyncDoc.getOrCreate(store);

      await Time.wait(0);
      expect(index.total()).to.eql(1);

      const res = SyncDoc.purge(index);
      expect(index.total()).to.eql(0);
      expect(res).to.eql([doc.uri]);

      store.dispose();
    });
  });

  describe('SyncDoc.Patches', () => {
    const setup = async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await SyncDoc.getOrCreate(store);

      const events = {
        doc: doc.events(),
        index: index.events(),
      } as const;

      const fired: t.DocChanged<t.WebrtcSyncDoc>[] = [];
      events.doc.changed$.subscribe((e) => fired.push(e));

      return { store, index, doc, events, fired };
    };

    it('Patches.shared', async () => {
      const { store, doc, fired } = await setup();

      const uri = 'automerge:foo';
      doc.change((d) => (d.shared[uri] = { current: true, version: 1 }));
      doc.change((d) => (d.shared[uri] = { current: false, version: 2 }));
      doc.change((d) => delete d.shared[uri]);

      const res1 = SyncDoc.Patches.shared(fired[0]);
      const res2 = SyncDoc.Patches.shared(fired[1]);
      const res3 = SyncDoc.Patches.shared(fired[2]);

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

  describe('SyncDoc.Sync', () => {
    it('Sync.listenToIndex: add → rename → remove', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const syncdoc = await SyncDoc.getOrCreate(store);

      listenToIndex(index, syncdoc);
      expect(syncdoc.current.shared).to.eql({});

      const uri = 'automerge:foo';
      await index.add({ uri });
      expect(syncdoc.current.shared).to.eql({}); // NB: not yet shared.

      // Share.
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[1], { shared: true }));
      expect(syncdoc.current.shared[uri]).to.eql({ current: true, version: 1 }); // NB: entry now exists on the sync-doc.

      // Remove.
      index.remove(uri);
      expect(syncdoc.current.shared[uri].current).to.eql(false);
      expect(syncdoc.current.shared[uri].version).to.eql(2);
      store.dispose();
    });

    it('Sync.all (pre-existing index)', async () => {

    it('Sync.indexIntoDoc (all items from pre-existing [Index])', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await SyncDoc.getOrCreate(store);

      await index.add({ uri: 'automerge:a' }); // Not shared.
      await index.add({ uri: 'automerge:b' });
      await index.add({ uri: 'automerge:c' });

      index.doc.change((d) => (d.docs[2].name = 'hello'));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[2], { shared: true }));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d.docs[3], { shared: true }));

      // Ensure the syncer updated the doc.
      SyncDoc.Sync.indexIntoDoc(index, doc);
      const shared = doc.current.shared;
      expect(shared['automerge:a']).to.eql(undefined);
      expect(shared['automerge:b']).to.eql({ current: true, version: 1 });
      expect(shared['automerge:c']).to.eql({ current: true, version: 1 });

      store.dispose();
    });
  });
});
