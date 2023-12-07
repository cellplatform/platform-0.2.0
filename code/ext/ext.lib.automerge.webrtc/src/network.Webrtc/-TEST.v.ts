import { SyncDoc } from '.';
import { Doc, Store, describe, expect, it } from '../test';

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

  describe('SyncDoc.Sync', () => {
    it('listenToIndex: add → rename → remove', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await SyncDoc.getOrCreate(store);

      SyncDoc.listenToIndex({ index, doc });
      expect(doc.current.shared).to.eql({});

      const uri = 'automerge:foo';
      await index.add(uri);
      expect(doc.current.shared).to.eql({}); // NB: not yet shared.

      // Share.
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 1, { value: true }));
      expect(doc.current.shared[uri]).to.eql(true); // NB: entry now exists on the sync-doc.

      // Remove.
      await index.remove(uri);
      expect(doc.current.shared).to.eql({});

      store.dispose();
    });

    it('Sync.all (pre-existing index)', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const doc = await SyncDoc.getOrCreate(store);

      await index.add('automerge:a'); // Not shared.
      await index.add('automerge:b');
      await index.add('automerge:c');

      index.doc.change((d) => (d.docs[2].name = 'hello'));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 2, { value: true }));
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 3, { value: true }));

      SyncDoc.Sync.all(index, doc);

      // Ensure the syncer updated the doc.
      const shared = doc.current.shared;
      expect(shared['automerge:a']).to.eql(undefined);
      expect(shared['automerge:b']).to.eql(true);
      expect(shared['automerge:c']).to.eql(true);

      store.dispose();
    });
  });
});
