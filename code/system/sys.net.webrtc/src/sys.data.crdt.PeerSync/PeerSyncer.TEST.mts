import { Automerge } from 'sys.data.crdt';

import { PeerSyncer } from '../sys.data.crdt.PeerSync';
import { Dev, expect, rx, t, TEST, Time, WebRTC } from '../test.ui';

export default Dev.describe('CRDT (sync protocol)', (e) => {
  const signal = TEST.signal;
  const SECOND = 1000;
  e.timeout(15 * SECOND);

  const peers = async (length: number, getStream?: t.PeerGetMediaStream) => {
    const wait = Array.from({ length }).map(() => WebRTC.peer({ signal, getStream }));
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

  e.it('change → sync', async (e) => {
    let docA = createTestDoc();
    let docB = createTestDoc();

    function toSyncer<D>(conn: t.PeerDataConnection, getDoc: () => D, setDoc: (doc: D) => void) {
      const $ = conn.$.pipe(rx.map((e) => e.event));
      const fire = conn.send;
      const bus = { $, fire };
      return PeerSyncer<D>({ bus, getDoc, setDoc });
    }

    const syncerA = toSyncer(
      connA,
      () => docA,
      (d) => (docA = d),
    );
    const syncerB = toSyncer(
      connB,
      () => docB,
      (d) => (docB = d),
    );

    docA = Automerge.change(docA, 'hello-a', (doc) => (doc.name = 'Foo'));
    await Time.wait(200);
    docB = Automerge.change(docB, 'hello-b', (doc) => (doc.count = 1234));
    await Time.wait(20);
    syncerA.update();

    await Time.wait(1000);

    expect(docA).to.eql({ name: 'Foo', count: 1234 });
    expect(docB).to.eql({ name: 'Foo', count: 1234 });
  });

  e.it('dispose', async (e) => {
    peerA.dispose();
    peerB.dispose();
  });
});
