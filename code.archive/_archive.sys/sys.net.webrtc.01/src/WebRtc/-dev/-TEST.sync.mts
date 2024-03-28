import { PeerSyncer } from 'sys.data.crdt';
import { Automerge, Dev, expect, type t, TEST_DEFAULTS, Time, WebRtc } from '../../test.ui';

export default Dev.describe('WebRTC ⇔ CRDT (Sync Protocol)', (e) => {
  const signal = TEST_DEFAULTS.signal;
  const SECOND = 1000;
  e.timeout(15 * SECOND);

  const peers = async (length: number, getStream?: t.PeerGetMediaStream) => {
    const wait = Array.from({ length }).map(() => WebRtc.peer(signal, { getStream }));
    return await Promise.all(wait);
  };

  type Doc = {
    name?: string;
    count: number;
  };

  let peerA: t.Peer;
  let peerB: t.Peer;
  let connA: t.PeerDataConnection;
  let connB: t.PeerDataConnection;

  function createTestDoc() {
    const doc = Automerge.init<Doc>();
    return Automerge.change(doc, (doc) => (doc.count = 0));
  }

  e.describe('PeerSyncer', (e) => {
    e.it('init: create peers A ⇔ B and start data connection', async (e) => {
      const [a, b] = await peers(2);
      peerA = a;
      peerB = b;

      connA = await peerA.data(peerB.id);
      await Time.wait(300);
      connB = peerB.connections.data[0];

      expect(connA.peer.remote).to.eql(peerB.id);
      expect(connB.peer.remote).to.eql(peerA.id);
    });

    e.it('change → sync (bloom filters)', async (e) => {
      let docA = createTestDoc();
      let docB = createTestDoc();

      const syncerA = PeerSyncer(
        connA.bus(),
        'doc-id',
        () => docA,
        (d) => (docA = d),
      );
      const syncerB = PeerSyncer(
        connB.bus(),
        'doc-id',
        () => docB,
        (d) => (docB = d),
      );

      docA = Automerge.change(docA, 'hello-a', (doc) => (doc.name = 'Foo'));
      docB = Automerge.change(docB, 'hello-b', (doc) => (doc.count = 1234));

      expect(docA).to.eql({ name: 'Foo', count: 0 });
      expect(docB).to.eql({ count: 1234 });

      await syncerA.update();
      await Time.wait(1500);

      expect(docA).to.eql({ name: 'Foo', count: 1234 });
      expect(docB).to.eql({ name: 'Foo', count: 1234 });
    });

    e.it('dispose', async (e) => {
      peerA.dispose();
      peerB.dispose();
    });
  });
});
