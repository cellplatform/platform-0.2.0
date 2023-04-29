import { WebRtcController } from '..';
import { Crdt, Dev, expect, rx, t, TestNetwork, Time, WebRtc } from '../../test.ui';

export default Dev.describe('Network Controller: 3-way connection', async (e) => {
  e.timeout(1000 * 50);
  const { dispose, dispose$ } = rx.disposable();

  let peerA: t.Peer;
  let peerB: t.Peer;
  let peerC: t.Peer;

  let controllerA: t.WebRtcEvents;
  let controllerB: t.WebRtcEvents;
  let controllerC: t.WebRtcEvents;

  const getState = async (events: t.WebRtcEvents) => (await events.info.get())?.state!;
  let stateA: t.NetworkSharedDocRef;
  let stateB: t.NetworkSharedDocRef;
  let stateC: t.NetworkSharedDocRef;

  e.it('setup peers: A ⇔ B ⇔ C', async (e) => {
    const [a, b, c] = await TestNetwork.peers(3, { getStream: true, dispose$ });
    peerA = a;
    peerB = b;
    peerC = c;

    controllerA = WebRtcController.listen(peerA, { dispose$ });
    controllerB = WebRtcController.listen(peerB, { dispose$ });
    controllerC = WebRtcController.listen(peerC, { dispose$ });

    stateA = await getState(controllerA);
    stateB = await getState(controllerB);
    stateC = await getState(controllerC);
  });

  e.it('connect: A ⇔ B ⇔ C', async (e) => {
    // await controllerA.connect.fire(peerB.id);
    // await controllerC.connect.fire(peerB.id);

    await controllerA.connect.fire(peerB.id);
    await controllerA.connect.fire(peerC.id);

    await Time.wait(3000);

    const write = async (prefix: string, events: t.WebRtcEvents) => {
      const info = (await events.info.get())!;
      const doc = Crdt.toObject(info.state.current);
      console.log(prefix, '(peers):', doc.network.peers);
    };

    console.log('-------------------------------------------');
    await write('A', controllerA);
    await write('B', controllerB);
    await write('C', controllerC);

    console.log('-------------------------------------------');
    console.log('peerA.', peerA.connections.length);
    console.log('peerB.', peerB.connections.length);
    console.log('peerC.', peerC.connections.length);

    expect(peerA.connections.length).to.eql(4); // NB: data + camera (*2)
    expect(peerB.connections.length).to.eql(4);
    expect(peerC.connections.length).to.eql(4);
  });

  e.it('dispose', async (e) => {
    // await Time.wait(500);
    dispose(); // NB: causes controller to be disposed (via dispose$).
  });
});
