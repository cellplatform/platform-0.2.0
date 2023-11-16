import { WebrtcStoreManager } from '.';
import { Test, Time, WebStore, Webrtc, expect } from '../test.ui';

type D = { count: number };

export default Test.describe('WebrtcNetworkAdapter', (e) => {
  e.timeout(9999);

  const testSetup = () => {
    const peer = Webrtc.peer();
    const events = peer.events();
    const store = WebStore.init({ network: [] });
    const generator = store.doc.factory<D>((d) => (d.count = 0));
    const manager = WebrtcStoreManager.init(store, peer);
    const dispose = () => {
      peer.dispose();
      store.dispose();
      manager.dispose();
    };
    return { peer, events, store, generator, manager, dispose } as const;
  };

  e.describe('Integration (Live)', (e) => {
    e.it('connects and sync docs over WebRTC', async (e) => {
      const wait = (msecs = 400) => Time.wait(msecs);

      const self = testSetup();
      await wait();
      const remote = testSetup();
      await wait();

      const firedAdd = { self: 0, remote: 0 };
      self.manager.added$.subscribe(() => firedAdd.self++);
      remote.manager.added$.subscribe(() => firedAdd.remote++);

      const res = await self.peer.connect.data(remote.peer.id);
      expect(res.error).to.eql(undefined);
      expect(self.manager.total.added).to.eql(1);
      expect(remote.manager.total.added).to.eql(1);
      expect(firedAdd.self).to.eql(1);
      expect(firedAdd.remote).to.eql(1);

      const docSelf = await self.generator();
      await wait();
      const docRemote = await remote.generator(docSelf.uri);
      await wait();
      expect(docSelf.current).to.eql({ count: 0 });
      expect(docRemote.current).to.eql({ count: 0 });

      docRemote.change((d) => (d.count = 123));
      await wait(500);
      expect(docSelf.current).to.eql({ count: 123 });
      expect(docRemote.current).to.eql({ count: 123 });
    });
  });

  e.describe('WebrtcStoreManager', (e) => {
    e.it('initialize', async (e) => {
      const { dispose, manager } = testSetup();
      expect(manager.total.added).to.eql(0);
      dispose();
    });

    e.it('dispose: when Peer disposes', async (e) => {
      const { peer, dispose, manager } = testSetup();
      expect(manager.disposed).to.eql(false);
      peer.dispose();
      expect(manager.disposed).to.eql(true);
      dispose();
    });

    e.it('dispose: when Store disposes', async (e) => {
      const { store, dispose, manager } = testSetup();
      expect(manager.disposed).to.eql(false);
      store.dispose();
      expect(manager.disposed).to.eql(true);
      dispose();
    });
  });
});
