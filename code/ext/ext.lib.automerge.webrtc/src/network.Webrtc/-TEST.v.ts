import { IndexSync, WebrtcStore } from '.';
import { Store, describe, expect, it, type t } from '../test';

describe('network.Webrtc', () => {
  const SyncDoc = WebrtcStore.SyncDoc;

  describe('SyncDoc', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await SyncDoc.getOrCreate(store);
      expect(doc.current['.meta'].ephemeral).to.eql(true);
      expect(doc.current['index.shared']).to.eql({});
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
      doc.change((d) => (d['index.shared'][uri] = {}));
      doc.change((d) => delete d['index.shared'][uri]);

      const res1 = SyncDoc.Patches.shared(fired.changes[0]);
      const res2 = SyncDoc.Patches.shared(fired.changes[1]);

      expect(res1.put?.uri).to.eql(uri);
      expect(res1.del).to.eql(undefined);

      expect(res2.put).to.eql(undefined);
      expect(res2.del?.uri).to.eql(uri);

      store.dispose();
    });
  });

  describe('IndexSync.local', () => {
    it('add → rename → remove', async () => {
      const store = Store.init();
      const index = await Store.index(store);
      const local = await SyncDoc.getOrCreate(store);

      IndexSync.local(index, { local });
      expect(local.current['index.shared']).to.eql({});

      const uri = 'automerge:foo';
      await index.add(uri);
      expect(local.current['index.shared']).to.eql({}); // NB: not yet shared.

      // Share.
      index.doc.change((d) => Store.Index.Mutate.toggleShared(d, 1, { value: true }));
      expect(local.current['index.shared'][uri]).to.eql({}); // NB: entry now on the sync-doc.

      // Rename.
      index.doc.change((d) => (d.docs[1].name = 'foo'));
      expect(local.current['index.shared'][uri]).to.eql({ name: 'foo' });
      index.doc.change((d) => delete d.docs[1].name);
      expect(local.current['index.shared'][uri]).to.eql({}); // NB: name removed

      // Remove.
      await index.remove(uri);
      expect(local.current['index.shared']).to.eql({});

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
      const shared = local.current['index.shared'];
      expect(shared['automerge:a']).to.eql(undefined);
      expect(shared['automerge:b']).to.eql({ name: 'hello' });
      expect(shared['automerge:c']).to.eql({});

      store.dispose();
    });
  });
});
