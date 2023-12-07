import { IndexSync, WebrtcStore } from '.';
import { Doc, Store, describe, expect, it, type t } from '../test';

describe('network.Webrtc', () => {
  const SyncDoc = WebrtcStore.SyncDoc;

  describe('SyncDoc', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await SyncDoc.getOrCreate(store);
      expect(doc.current['.meta'].ephemeral).to.eql(true);
      expect(doc.current.shared).to.eql([]);
      store.dispose();
    });

    it('purge', async () => {
      const store = Store.init();
      const index = await Store.index(store);

      expect(index.total()).to.eql(0);
      const doc = await SyncDoc.getOrCreate(store);
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
      const events = doc.events();
      const changes: t.DocChanged<t.WebrtcSyncDoc>[] = [];
      events.changed$.subscribe((e) => changes.push(e));
      return { store, index, doc, events, fired: { changes } } as const;
    };

    it('Patches.shared', async () => {
      const { store, doc, fired } = await setup();
      const uri = 'automerge:foo';
      doc.change((d) => d.shared.push(uri));
      doc.change((d) => Doc.Data.array(d.shared).deleteAt(0));

      const res1 = SyncDoc.Patches.docs(fired.changes[0]);
      const res2 = SyncDoc.Patches.docs(fired.changes[1]);

      expect(res1.insert?.uri).to.eql(uri);
      expect(res1.remove).to.eql(undefined);

      expect(res2.insert).to.eql(undefined);
      expect(res2.remove?.uri).to.eql(uri);

      store.dispose();
    });
  });

  describe('IndexSync.local', () => {
    it('add → rename → remove', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const local = await SyncDoc.getOrCreate(store);

      IndexSync.local(index, { local });
      expect(local.current.shared).to.eql([]);

      const uri = 'automerge:foo';
      await index.add(uri);
      expect(local.current.shared).to.eql([]); // NB: not yet shared.

      // Share.
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 1, { value: true }));
      expect(local.current.shared).to.includes(uri); // NB: entry now on the sync-doc.

      // Remove.
      await index.remove(uri);
      expect(local.current.shared).to.eql([]);

      store.dispose();
    });

    it('pre-existing index', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const local = await SyncDoc.getOrCreate(store);

      await index.add('automerge:a'); // Not shared.
      await index.add('automerge:b');
      await index.add('automerge:c');

      index.doc.change((d) => (d.docs[2].name = 'hello'));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 2, { value: true }));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 3, { value: true }));

      // Start the sync.
      IndexSync.local(index, { local });

      // Ensure the syncer updated the doc.
      const docs = local.current.shared;
      expect(docs.includes('automerge:a')).to.eql(false);
      expect(docs.includes('automerge:b')).to.eql(true);
      expect(docs.includes('automerge:c')).to.eql(true);

      store.dispose();
    });
  });
});
