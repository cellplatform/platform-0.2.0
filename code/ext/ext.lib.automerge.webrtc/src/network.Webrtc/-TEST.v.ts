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
  });
});
