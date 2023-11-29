import { WebrtcStore } from '.';
import { Store, describe, expect, it, type t } from '../test';

describe('network.Webrtc', () => {
  const SyncDoc = WebrtcStore.SyncDoc;

  describe('SyncDoc', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await SyncDoc.getOrCreate(store);
      expect(doc.current['.meta'].ephemeral).to.eql(true);
      expect(doc.current.shared).to.eql({});
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
      const changes: t.DocChanged<t.WebrtcEphemeral>[] = [];
      events.changed$.subscribe((e) => changes.push(e));
      return { store, index, doc, events, fired: { changes } } as const;
    };

    it('Patches.shared', async () => {
      const { store, doc, fired } = await setup();
      const uri = 'automerge:foo';
      doc.change((d) => (d.shared[uri] = {}));
      doc.change((d) => delete d.shared[uri]);

      const res1 = SyncDoc.Patches.shared(fired.changes[0]);
      const res2 = SyncDoc.Patches.shared(fired.changes[1]);

      expect(res1.put).to.eql(uri);
      expect(res1.del).to.eql(undefined);

      expect(res2.put).to.eql(undefined);
      expect(res2.del).to.eql(uri);

      store.dispose();
    });
  });
});
