import { WebrtcStore } from '.';
import { Store, describe, expect, it } from '../test';

describe('network.Webrtc', () => {
  describe('SyncDoc', () => {
    it('getOrCreate', async () => {
      const store = Store.init();
      const doc = await WebrtcStore.SyncDoc.getOrCreate(store);
      expect(doc.current['.meta'].ephemeral).to.eql(true);
      expect(doc.current.shared).to.eql({});
      store.dispose();
    });

    it('purge', async () => {
      const store = Store.init();
      const index = await Store.index(store);

      expect(index.total()).to.eql(0);
      const doc = await WebrtcStore.SyncDoc.getOrCreate(store);
      expect(index.total()).to.eql(1);

      const res = WebrtcStore.SyncDoc.purge(index);
      expect(index.total()).to.eql(0);
      expect(res).to.eql([doc.uri]);

      store.dispose();
    });
  });
});
