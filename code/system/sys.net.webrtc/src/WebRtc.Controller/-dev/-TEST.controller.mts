import { WebRtcController } from '..';
import {
  Crdt,
  Dev,
  expect,
  Filesystem,
  Pkg,
  rx,
  t,
  TestNetwork,
  Time,
  WebRtc,
} from '../../test.ui';
import { pruneDeadPeers } from '../util.mjs';

type DocShared = {
  network: t.NetworkState;
};

export default Dev.describe('Network Controller (CRDT)', async (e) => {
  e.timeout(1000 * 50);

  const { dispose, dispose$ } = rx.disposable();

  const Mutate = WebRtcController.Mutate;
  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus, dispose$ })).fs;
  const filedir = fs.dir('dev.test.WebRtc.Controller');

  const setup = () => {
    const initial: DocShared = { network: { peers: {} } };
    const state = Crdt.Doc.ref<DocShared>('doc-id', initial, { dispose$ });
    return { initial, state };
  };

  e.it('exposed from root API', (e) => {
    expect(WebRtcController).to.equal(WebRtc.Controller);
  });

  let peerA: t.Peer;
  let peerB: t.Peer;
  let peerC: t.Peer;

  e.it('setup peers A ⇔ B', async (e) => {
    const [a, b, c] = await TestNetwork.peers(3, { getStream: true });
    peerA = a;
    peerB = b;
    peerC = c;
  });

  e.describe('EventBus', (e) => {
    const { state } = setup();
    let controller: t.WebRtcEvents;

    e.it('default generated bus (← info method)', async (e) => {
      controller = WebRtcController.listen(peerA, state);
      const info = await controller.info.get();
      controller.dispose();
      expect(info?.peer).to.equal(peerA);
    });

    e.it('specified bus (← info method)', async (e) => {
      const bus = rx.bus();
      controller = WebRtcController.listen(peerA, { bus });

      const events1 = WebRtc.events(bus, peerA.id);
      const events2 = WebRtc.events(bus, peerA);

      const info1 = await events1.info.get();
      const info2 = await events2.info.get();
      controller.dispose();

      expect(info1?.peer).to.equal(peerA);
      expect(info2?.peer).to.equal(peerA);
    });

    e.it('info (← provided network state)', async (e) => {
      controller = WebRtcController.listen(peerA, { state });
      const info = await controller.info.get();
      controller.dispose();

      expect(info?.module.name).to.eql(Pkg.name);
      expect(info?.module.version).to.eql(Pkg.version);
      expect(info?.peer).to.equal(peerA);
      expect(info?.state.current.network.peers).to.eql({});
      expect(info?.state).to.equal(state);
      expect(info?.syncers).to.eql([]);
    });

    e.it('info (← generated network state)', async (e) => {
      controller = WebRtcController.listen(peerA, {});
      const info = await controller.info.get();
      controller.dispose();

      expect(info?.state.current.network.peers).to.eql({});
      expect(info?.state).to.not.equal(state); // NB: generated state document within controller.
    });
  });

  e.describe('Controller.listen', (e) => {
    const { state, initial } = setup();
    let controller: t.WebRtcEvents;

    e.it('init: start listening to a network - ["local:peer" + crdt.doc<shared>]', async (e) => {
      const self = peerA;
      controller = WebRtcController.listen(self, {
        state,
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
    });

    e.it('connect peer: A → B (initiated by A)', async (e) => {
      const self = peerA.id;
      const remote = peerB.id;
      const wait = rx.firstValueFrom(controller.connect.complete$);

      const firedStart: t.WebRtcConnectStart[] = [];
      const firedComplete: t.WebRtcConnectStart[] = [];
      controller.connect.start$.subscribe((e) => firedStart.push(e));
      controller.connect.complete$.subscribe((e) => firedComplete.push(e));

      /**
       * Adding peer to document (CRDT) initiates the
       * controller's connection sequence.
       */
      state.change((d) => {
        const initiatedBy = self;
        Mutate.addPeer(d.network, self, remote, { initiatedBy });
      });

      const info1 = await controller.info.get();
      expect(info1?.syncers).to.eql([]);

      await wait;
      const doc = state.current;
      const p1 = doc.network.peers[self];
      const p2 = doc.network.peers[remote];

      expect(p1.initiatedBy).to.eql(self);
      expect(p2.initiatedBy).to.eql(self);

      expect(p1.error).to.eql(undefined);
      expect(p2.error).to.eql(undefined);

      expect(firedStart.length).to.eql(1);
      expect(firedComplete.length).to.eql(1);
      expect(firedComplete[0].peer).to.eql({ local: self, remote });

      const info2 = await controller.info.get();
      const syncers = info2?.syncers ?? [];
      expect(syncers.length).to.eql(1);

      expect(syncers[0].local).to.eql(self);
      expect(syncers[0].remote).to.eql(remote);
      expect(syncers[0].syncer.doc).to.equal(state);

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

    e.it('connect peer (via events): A → C (initiated by A)', async (e) => {
      const firedStart: t.WebRtcConnectStart[] = [];
      const firedComplete: t.WebRtcConnectStart[] = [];
      controller.connect.start$.subscribe((e) => firedStart.push(e));
      controller.connect.complete$.subscribe((e) => firedComplete.push(e));

      const info1 = (await controller.info.get())!;
      expect(info1.syncers.length).to.eql(1, '(1) total syncers');

      /**
       * NOTE:
       *   This updated the shared-state {network.peers} via the controller.
       */
      const res = await controller.connect.fire(peerC.id);
      expect(res.peer.local).to.eql(peerA.id);
      expect(res.peer.remote).to.eql(peerC.id);

      const info2 = (await controller.info.get())!;
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

    e.it('[fail] connect peer: A → FOO-404', async (e) => {
      const self = peerA.id;
      const remote = 'FOO-404';

      const errors: t.PeerError[] = [];
      controller.errors.peer$.subscribe((e) => errors.push(e));

      /**
       * Adding peer to document (CRDT) initiates the
       * controller's connection sequence.
       */
      state.change((d) => {
        const initiatedBy = self;
        Mutate.addPeer(d.network, self, remote, { initiatedBy });
      });
      expect(state.current.network.peers[remote].initiatedBy).to.eql(self);

      await rx.firstValueFrom(controller.errors.peer$);
      expect(errors.length).to.eql(1);
      expect(errors[0].type === 'peer-unavailable').to.eql(true);

      await Time.wait(10);
      const doc = state.current;
      const p2 = doc.network.peers[remote];
      expect(p2.error).to.include(errors[0].message);
      expect(p2.error).to.include('[peer-unavailable]');
    });

    e.it('kill peer-B → auto removed from peer-A state doc', async (e) => {
      const remote = peerB.id;
      expect(state.current.network.peers[remote]).to.exist;

      peerB.dispose(); // Kill the peer.
      await Time.wait(500);
      expect(state.current.network.peers[remote]).to.not.exist;
    });

    e.it('prune dead peers', async (e) => {
      const state = Crdt.Doc.ref<DocShared>('doc-id', initial, { dispose$ });
      state.change((d) => Mutate.addPeer(d.network, 'A', 'B', { initiatedBy: 'A' }));

      expect(state.current.network.peers['B']).to.exist;

      const res = await pruneDeadPeers(peerA, state);
      expect(res.removed).to.eql(['B']);
      expect(state.current.network.peers['B']).to.not.exist;

      /**
       * TODO 🐷
       * - Ensure pruning removes "FOO-404"
       */

      // expect(state.current.network.peers['FOO-404']).to.not.exist;
    });

    e.it('dispose', async (e) => {
      await Time.wait(300);
      let count = 0;
      controller.dispose$.subscribe(() => count++);

      dispose(); // NB: causes controller to be disposed (via dispose$).
      expect(controller.disposed).to.eql(true);
      expect(count).to.eql(1);
    });
  });
});
