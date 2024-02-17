import { WebRtcController } from '..';
import {
  Crdt,
  Dev,
  Filesystem,
  Pkg,
  TestNetwork,
  Time,
  UserAgent,
  WebRtc,
  expect,
  rx,
  type t,
} from '../../test.ui';

export default Dev.describe('Network Controller', async (e) => {
  e.timeout(1000 * 50);
  const { dispose, dispose$ } = rx.disposable();

  const Mutate = WebRtc.State.Mutate;
  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus, dispose$ })).fs;
  const filedir = fs.dir('dev.test.WebRtc.Controller');

  const setup = () => {
    const initial = WebRtc.NetworkSchema.initial.doc;
    const doc = Crdt.Doc.ref<t.NetworkDocShared>('doc-id', initial, { dispose$ });
    return { initial, doc };
  };

  e.it('exposed from root API', (e) => {
    expect(WebRtcController).to.equal(WebRtc.Controller);
  });

  let peerA: t.Peer;
  let peerB: t.Peer;
  let peerC: t.Peer;

  e.it('setup peers: A ⇔ B ⇔ C', async (e) => {
    const [a, b, c] = await TestNetwork.peers(3, { getStream: true, dispose$ });
    peerA = a;
    peerB = b;
    peerC = c;
  });

  e.it('state', (e) => {
    const { doc } = setup();
    const ctrl1 = WebRtcController.listen(peerA);
    const ctrl2 = WebRtcController.listen(peerA, { doc });
    expect(ctrl1.state.kind).to.eql('WebRtc:State');
    expect(ctrl2.state.doc).to.equal(doc);
  });

  e.describe('EventBus: controller.client ← (controller.listen)', (e) => {
    const { doc } = setup();

    e.it('default auto-generated bus', async (e) => {
      const controller = WebRtcController.listen(peerA);
      const client = controller.client();
      const info = await client.info.get();
      expect(info?.peer).to.equal(peerA);
      controller.dispose();
    });

    e.it('uses specified bus', async (e) => {
      const bus = rx.bus();
      const controller = WebRtcController.listen(peerA, { bus });

      const client1 = WebRtc.client(bus, peerA.id);
      const client2 = WebRtc.client(bus, peerA);

      const info1 = await client1.info.get();
      const info2 = await client2.info.get();
      controller.dispose();
      client1.dispose();
      client2.dispose();

      expect(info1?.peer).to.equal(peerA);
      expect(info2?.peer).to.equal(peerA);
    });

    e.it('auto-generated network state CRDT', async (e) => {
      const controller = WebRtcController.listen(peerA, {});
      const client = controller.client();
      const info = await client.info.get();
      controller.dispose();
      expect(info?.state).to.not.equal(doc); // NB: generated state document within controller.
      expect(info?.state.current.network.peers[peerA.id].id).to.eql(peerA.id); // NB: Auto added self to {peers}
    });

    e.it('provided network state (CRDT)', async (e) => {
      expect(doc.current.network.peers).to.eql({});

      const controller = WebRtcController.listen(peerA, { doc: doc });
      const client = controller.client();
      const info = await client.info.get();
      controller.dispose();

      expect(info?.module.name).to.eql(Pkg.name);
      expect(info?.module.version).to.eql(Pkg.version);
      expect(info?.peer).to.equal(peerA);
      expect(info?.state.current.network.peers[peerA.id].id).to.eql(peerA.id); // NB: Auto added self to {peers}
      expect(info?.state).to.equal(doc);
      expect(info?.syncers).to.eql([]);
    });

    e.it('auto assigns the local meta-data', async (e) => {
      const controller = WebRtcController.listen(peerA, {});
      const client = controller.client();
      const state = (await client.info.state())!;
      controller.dispose();

      const self = state.current.network.peers[peerA.id];
      expect(self.id).to.eql(peerA.id);
      expect(self.device.userAgent).to.eql(UserAgent.current);
    });

    e.it('provided network state already has {self} peer.', async (e) => {
      const { doc } = setup();
      expect(doc.current.network.peers).to.eql({}); // NB: No peers at this point.

      const get = (state?: t.NetworkDocShared) => state?.network.peers[peerA.id];

      doc.change((d) => Mutate.addPeer(d.network, peerA.id, peerA.id)); // NB: Add self.
      expect(get(doc.current)?.id).to.eql(peerA.id);

      const controller = WebRtcController.listen(peerA, { doc: doc });
      const client = controller.client();
      const info = await client.info.get();
      controller.dispose();
      doc.dispose();

      expect(get(info?.state.current)).to.eql(get(doc.current));
    });

    e.it('dispose', (e) => {
      const { dispose$, dispose } = rx.disposable();
      const controller = WebRtcController.listen(peerA);
      const client1 = controller.client();
      const client2 = controller.client();
      const client3 = controller.client(dispose$);

      expect(client1.instance).to.eql(client2.instance);
      expect(client1).to.not.equal(client2); // NB: Not same instance.

      client1.dispose();
      expect(controller.disposed).to.eql(false);
      expect(client1.disposed).to.eql(true);
      expect(client2.disposed).to.eql(false);
      expect(client3.disposed).to.eql(false);

      dispose();
      expect(controller.disposed).to.eql(false);
      expect(client1.disposed).to.eql(true);
      expect(client2.disposed).to.eql(false);
      expect(client3.disposed).to.eql(true); // NB: via dispose$ in param

      controller.dispose();
      expect(controller.disposed).to.eql(true);
      expect(client1.disposed).to.eql(true); // NB: Already disposed.
      expect(client2.disposed).to.eql(true); // NB: Disposed via controller.
      expect(client3.disposed).to.eql(true);
    });

    e.it('dispose$', (e) => {
      const { dispose$, dispose } = rx.disposable();
      const controller = WebRtcController.listen(peerA, { dispose$ });
      const client = controller.client();

      dispose();
      expect(controller.disposed).to.eql(true);
      expect(client.disposed).to.eql(true);
    });
  });

  e.describe('EventBus: controller.withClient ← (controller.listen)', (e) => {
    e.it('invokes with isolated transient event-bus', async (e) => {
      const controller = WebRtcController.listen(peerA);
      let info: t.WebRtcInfo | undefined;
      let client1: t.WebRtcEvents | undefined;
      let client2: t.WebRtcEvents | undefined;

      await controller.withClient(async (client) => {
        client1 = client;
        info = await client.info.get();
      });

      await controller.withClient((client) => {
        client2 = client;
      });

      expect(client1?.disposed).to.eql(true);
      expect(client2?.disposed).to.eql(true);
      expect(info?.peer.id).to.eql(peerA.id);
    });
  });

  e.describe.skip('Controller.listen', (e) => {
    const { doc } = setup();
    let controller: t.WebRtcController;
    let client: t.WebRtcEvents;

    e.it('init: start listening to the network', async (e) => {
      const self = peerA;
      controller = WebRtcController.listen(self, {
        doc: doc,
        filedir,
        dispose$,
        onConnectStart(e) {
          // eg. start spinning
          // console.log('onConnectStart', e);
        },
        onConnectComplete(e) {
          // eg. stop spinning
          // console.log('onConnectComplete', e);
        },
      });
      client = controller.client();

      const info = await client.info.get();
      expect(info?.state.current.network.peers[peerA.id].id).to.eql(peerA.id); // NB: Auto added self to {peers}
    });

    e.it('connect peer: A → B (initiated by A)', async (e) => {
      const self = peerA.id;
      const remote = peerB.id;
      const wait = rx.firstValueFrom(client.connect.complete$);

      const firedStart: t.WebRtcConnectStart[] = [];
      const firedComplete: t.WebRtcConnectStart[] = [];
      client.connect.start$.subscribe((e) => firedStart.push(e));
      client.connect.complete$.subscribe((e) => firedComplete.push(e));

      /**
       * Adding peer to document (CRDT) initiates the
       * controller's connection sequence.
       */
      doc.change((d) => {
        const initiatedBy = self;
        Mutate.addPeer(d.network, self, remote, { initiatedBy });
      });

      const info1 = await client.info.get();
      expect(info1?.syncers).to.eql([]);

      await wait;
      const p1 = doc.current.network.peers[self];
      const p2 = doc.current.network.peers[remote];

      expect(p1.initiatedBy).to.eql(self);
      expect(p2.initiatedBy).to.eql(self);

      expect(p1.error).to.eql(undefined);
      expect(p2.error).to.eql(undefined);

      expect(firedStart.length).to.eql(1);
      expect(firedComplete.length).to.eql(1);
      expect(firedComplete[0].peer).to.eql({ local: self, remote });

      const info2 = await client.info.get();
      const syncers = info2?.syncers ?? [];
      expect(syncers.length).to.eql(1);

      expect(syncers[0].local).to.eql(self);
      expect(syncers[0].remote).to.eql(remote);
      expect(syncers[0].syncer.doc).to.equal(doc);

      // Ensure live connections match the synced state-document.
      await Time.wait(500);
      const connA = peerA.connections.data.find((conn) => conn.peer.remote === remote);
      const connB = peerB.connections.data.find((conn) => conn.peer.remote === self);

      expect(connA?.isOpen).to.eql(true);
      expect(connB?.isOpen).to.eql(true);

      expect(connA?.peer.local).to.eql(p1.id);
      expect(connA?.peer.remote).to.eql(p2.id);
      expect(connB?.peer.local).to.eql(p2.id);
      expect(connB?.peer.remote).to.eql(p1.id);
    });

    e.it('connect peer (via event-bus): A → C (initiated by A)', async (e) => {
      const firedStart: t.WebRtcConnectStart[] = [];
      const firedComplete: t.WebRtcConnectStart[] = [];
      client.connect.start$.subscribe((e) => firedStart.push(e));
      client.connect.complete$.subscribe((e) => firedComplete.push(e));

      const info1 = (await client.info.get())!;
      expect(info1.syncers.length).to.eql(1, '(1) total syncers');

      /**
       * NOTE:
       *   This updated the shared-state {network.peers} via the controller.
       */
      const res = await client.connect.fire(peerC.id);
      expect(res.peer.local).to.eql(peerA.id);
      expect(res.peer.remote).to.eql(peerC.id);

      const info2 = (await client.info.get())!;
      const network = info2?.state.current.network!;

      expect(network.peers[peerA.id]).to.exist;
      expect(network.peers[peerC.id]).to.exist;

      expect(firedStart.length).to.eql(1, 'fired-start');
      expect(firedComplete.length).to.eql(1, 'fired-complete');

      expect(info2.syncers.length).to.eql(2, '(2) total syncers');
      const item = info2.syncers[1];
      expect(item.local).to.eql(peerA.id);
      expect(item.remote).to.eql(peerC.id);
      expect(item.syncer.doc.current.network).to.eql(network);
    });

    e.it('close connection', async (e) => {
      const getNetwork = async () => (await client.info.state())?.current.network!;

      const network1 = await getNetwork();
      expect(network1.peers[peerA.id]).to.exist;
      expect(network1.peers[peerC.id]).to.exist;
      expect(peerA.connections.length).to.eql(2);

      const res = await client.close.fire(peerC.id);
      const network2 = await getNetwork();
      expect(res.state).to.eql(network2);
      expect(res.peer.local).to.eql(peerA.id);
      expect(res.peer.remote).to.eql(peerC.id);

      expect(network2.peers[peerA.id]).to.exist;
      expect(network2.peers[peerC.id]).to.not.exist; // NB: Removed from state-doc.
      expect(peerA.connections.length).to.eql(1);
    });

    e.it('dispose', (e) => {
      let count = 0;
      client.dispose$.subscribe(() => count++);

      dispose(); // NB: causes controller to be disposed (via dispose$).
      expect(controller.disposed).to.eql(true);
      expect(client.disposed).to.eql(true);
      expect(count).to.eql(1);
    });
  });
});
