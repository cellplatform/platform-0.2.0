import { WebrtcStore } from '.';
import { Test, Time, WebStore, Webrtc, expect, type t } from '../test.ui';

type D = { count: number };

export default Test.describe('WebrtcStore | WebrtcNetworkAdapter', (e) => {
  e.timeout(9999);

  const testSetup = () => {
    const peer = Webrtc.peer();
    const events = peer.events();
    const store = WebStore.init({ storage: false, network: [] });
    const generator = store.doc.factory<D>((d) => (d.count = 0));
    const network = WebrtcStore.init(peer, store);

    const added: t.WebrtcStoreAdapterAdded[] = [];
    const messages: t.WebrtcMessageAlert[] = [];
    network.added$.subscribe((e) => added.push(e));
    network.message$.subscribe((e) => messages.push(e));

    const dispose = () => {
      peer.dispose();
      store.dispose();
      network.dispose();
    };
    return {
      peer,
      events,
      store,
      generator,
      network,
      fired: { added, messages },
      dispose,
    } as const;
  };

  e.describe('Integration (Live)', (e) => {
    e.it('connects and sync douments over WebRTC', async (e) => {
      const wait = (msecs = 400) => Time.wait(msecs);
      const self = testSetup();
      await wait();
      const remote = testSetup();
      await wait();

      const res = await self.peer.connect.data(remote.peer.id);
      expect(res.error).to.eql(undefined);
      expect(self.network.total.added).to.eql(1);
      expect(remote.network.total.added).to.eql(1);

      expect(self.fired.added.length).to.eql(1);
      expect(remote.fired.added.length).to.eql(1);
      expect(self.fired.added[0].conn.id).to.eql(res.id);
      expect(self.fired.added[0].peer).to.eql(self.peer.id);

      expect(remote.fired.added[0].conn.id).to.eql(res.id);
      expect(remote.fired.added[0].peer).to.eql(remote.peer.id);

      const bytesBefore = {
        self: self.network.total.bytes,
        remote: remote.network.total.bytes,
      } as const;

      /**
       * Create a new document.
       */
      const docSelf = await self.generator();
      await wait();
      const docRemote = await remote.generator(docSelf.uri); // NB: knowledge of remote document URI.
      await wait();
      expect(docSelf.current).to.eql({ count: 0 });
      expect(docRemote.current).to.eql({ count: 0 });

      /**
       * Change the document and ensure it syncs over the network connection.
       */
      docRemote.change((d) => (d.count = 123));
      await wait(800);
      expect(docSelf.current).to.eql({ count: 123 });
      expect(docRemote.current).to.eql({ count: 123 });

      /**
       * Byte count (data transmitted).
       */
      const bytesAfter = {
        self: self.network.total.bytes,
        remote: remote.network.total.bytes,
      } as const;

      expect(bytesAfter.self).to.greaterThan(bytesBefore.self);
      expect(bytesAfter.remote).to.greaterThan(bytesBefore.remote);
      expect(areRoughlyTheSame(bytesAfter.self, bytesAfter.remote, 0.2)).to.eql(true);

      /**
       * Message events ⚡️
       */
      expect(self.fired.messages[0].message.type === 'welcome').to.eql(true);
      expect(remote.fired.messages[0].message.type === 'arrive').to.eql(true);
    });
  });

  e.describe('WebrtcStore (Network Manager)', (e) => {
    e.it('initialize', (e) => {
      const { dispose, network, store, peer } = testSetup();
      expect(network.total.added).to.eql(0);
      expect(network.store).to.equal(store);
      expect(network.peer).to.equal(peer);
      dispose();
    });

    e.it('dispose: when Peer disposes', (e) => {
      const { peer, dispose, network } = testSetup();
      expect(network.disposed).to.eql(false);
      peer.dispose();
      expect(network.disposed).to.eql(true);
      dispose();
    });

    e.it('dispose: when Store disposes', (e) => {
      const { store, dispose, network } = testSetup();
      expect(network.disposed).to.eql(false);
      store.dispose();
      expect(network.disposed).to.eql(true);
      dispose();
    });
  });
});

/**
 * Helpers
 */
function areRoughlyTheSame(left: number, right: number, tolerance: t.Percent): boolean {
  const average = (left + right) / 2;
  const difference = Math.abs(left - right);
  const allowedDifference = average * tolerance;
  return difference <= allowedDifference;
}
