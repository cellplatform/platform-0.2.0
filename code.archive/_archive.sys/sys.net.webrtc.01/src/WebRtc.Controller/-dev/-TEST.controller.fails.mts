import { WebRtcController } from '..';
import { Crdt, Dev, expect, rx, type t, TestNetwork, Time, WebRtc } from '../../test.ui';
import { pruneDeadPeers } from '../util.mjs';

export default Dev.describe('Network Controller: Failure', async (e) => {
  e.timeout(1000 * 50);
  const { dispose, dispose$ } = rx.disposable();
  const Mutate = WebRtc.State.Mutate;

  let peerA: t.Peer;
  let peerB: t.Peer;

  const initial = WebRtc.NetworkSchema.initial.doc;
  const doc = Crdt.Doc.ref<t.NetworkDocShared>('doc-id', initial, { dispose$ });
  let controller: t.WebRtcController;
  let client: t.WebRtcEvents;

  e.it('setup peers: A ⇔ B (listen)', async (e) => {
    const [a, b] = await TestNetwork.peers(2, { getStream: true, dispose$ });
    peerA = a;
    peerB = b;
    controller = WebRtcController.listen(peerA, { doc, dispose$ });
    client = controller.client();
  });

  e.it('connect peer: A → B', async (e) => {
    /**
     * NOTE:
     *   This updated the shared-state {network.peers} via the controller.
     */
    const res = await client.connect.fire(peerB.id);
    expect(res.peer.local).to.eql(peerA.id);
    expect(res.peer.remote).to.eql(peerB.id);

    const info = (await client.info.get())!;
    const network = info?.state.current.network!;

    expect(network.peers[peerA.id]).to.exist;
    expect(network.peers[peerB.id]).to.exist;
  });

  e.it('[fail] connect peer: A → FOO-404', async (e) => {
    const self = peerA.id;
    const remote = 'FOO-404';

    const errors: t.PeerError[] = [];
    client.errors.peer$.subscribe((e) => errors.push(e));

    /**
     * Adding peer to document (CRDT) initiates the
     * controller's connection sequence.
     */
    doc.change((d) => {
      const initiatedBy = self;
      Mutate.addPeer(d.network, self, remote, { initiatedBy });
    });
    expect(doc.current.network.peers[remote].initiatedBy).to.eql(self);

    await rx.firstValueFrom(client.errors.peer$);
    expect(errors.length).to.eql(1);
    expect(errors[0].type === 'peer-unavailable').to.eql(true);

    await Time.wait(10);
    const p2 = doc.current.network.peers[remote];
    expect(p2.error).to.include(errors[0].message);
    expect(p2.error).to.include('[peer-unavailable]');
  });

  e.it('kill peer-B → auto removed from peer-A state doc', async (e) => {
    const remote = peerB.id;
    expect(doc.current.network.peers[remote]).to.exist;

    peerB.dispose(); // Kill the peer.
    await Time.wait(500);
    expect(doc.current.network.peers[remote]).to.not.exist;
  });

  e.it('prune dead peers', async (e) => {
    const state = Crdt.Doc.ref<t.NetworkDocShared>('doc-id', initial, { dispose$ });
    state.change((d) => Mutate.addPeer(d.network, 'A', 'B', { initiatedBy: 'A' }));

    expect(state.current.network.peers['B']).to.exist;

    const res = await pruneDeadPeers(peerA, state);

    expect(res.removed).to.eql(['B']);
    expect(state.current.network.peers['B']).to.not.exist;
    expect(state.current.network.peers['FOO-404']).to.not.exist;
  });

  e.it('dispose', (e) => {
    let count = 0;
    controller.dispose$.subscribe(() => count++);

    dispose(); // NB: causes controller to be disposed (via dispose$).
    expect(controller.disposed).to.eql(true);
    expect(count).to.eql(1);
  });
});
