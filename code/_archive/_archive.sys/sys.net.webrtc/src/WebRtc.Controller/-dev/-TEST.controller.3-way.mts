import { WebRtcController } from '..';
import { Crdt, Dev, expect, rx, type t, TestNetwork, Time } from '../../test.ui';

export default Dev.describe('Network Controller: 3-way connections', async (e) => {
  e.timeout(1000 * 50);
  const { dispose, dispose$ } = rx.disposable();

  let peerA: t.Peer;
  let peerB: t.Peer;
  let peerC: t.Peer;

  let controllerA: t.WebRtcController;
  let controllerB: t.WebRtcController;
  let controllerC: t.WebRtcController;

  const getState = async (controller: t.WebRtcController) => {
    const client = controller.client();
    const info = (await client.info.get())?.state!;
    client.dispose();
    return info;
  };
  let stateA: t.NetworkDocSharedRef;
  let stateB: t.NetworkDocSharedRef;
  let stateC: t.NetworkDocSharedRef;

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
    const clientA = controllerA.client();
    const clientC = controllerA.client();

    await clientA.connect.fire(peerB.id);
    await clientC.connect.fire(peerB.id);

    await Time.wait(5000);

    const write = async (prefix: string, controller: t.WebRtcController) => {
      await controller.withClient(async (client) => {
        const info = (await client.info.get())!;
        const doc = Crdt.toObject(info.state.current);
        console.info(prefix, doc);
      });
    };

    console.log('-------------------------------------------');
    await write('A', controllerA);
    await write('B', controllerB);
    await write('C', controllerC);

    console.log('-------------------------------------------');
    console.log('peerA.', peerA.connections.length);
    console.log('peerB.', peerB.connections.length);
    console.log('peerC.', peerC.connections.length);

    await Time.wait(1000);

    expect(peerA.connections.length).to.eql(2);
    expect(peerB.connections.length).to.eql(2);
    expect(peerC.connections.length).to.eql(2);

    clientA.dispose();
    clientC.dispose();
  });

  e.it('state change | sync: A ⇔ B ⇔ C', async (e) => {
    stateA.change((d) => (d.tmp.message = 'hello'));

    /**
     * TODO 🐷
     * - Figure out a nice way with Observable$ to wait for the change to propogate to all peers.
     * - To avoid the "wait" below.
     */

    await Time.wait(2000);

    // NB: Change propogated to all peers (all same).
    expect(stateA.current).to.eql(stateB.current);
    expect(stateB.current).to.eql(stateC.current);
  });

  e.it('dispose', async (e) => {
    // await Time.wait(500);
    dispose(); // NB: causes controller to be disposed (via dispose$).
  });
});
