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
  toObject,
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

  const initialState: DocShared = { network: { peers: {} } };
  const stateDoc = Crdt.Doc.ref<DocShared>(initialState, { dispose$ });
  let controller: t.WebRtcEvents;

  e.it('exposed from root API', (e) => {
    expect(WebRtcController).to.equal(WebRtc.Controller);
  });

  let peerA: t.Peer;
  let peerB: t.Peer;

  e.it('setup peers A ⇔ B', async (e) => {
    const [a, b] = await TestNetwork.peers(2, { getStream: true });
    peerA = a;
    peerB = b;
  });

  e.describe('event-bus', (e) => {
    e.it('default generated bus (← info method)', async (e) => {
      controller = WebRtcController.listen(peerA, stateDoc);
      const info = await controller.info.get();
      controller.dispose();
      expect(info?.peer).to.equal(peerA);
    });

    e.it('specified bus (← info method)', async (e) => {
      const bus = rx.bus();
      controller = WebRtcController.listen(peerA, stateDoc, { bus });

      const events1 = WebRtc.events(bus, peerA.id);
      const events2 = WebRtc.events(bus, peerA);

      const info1 = await events1.info.get();
      const info2 = await events2.info.get();

      expect(info1?.peer).to.equal(peerA);
      expect(info2?.peer).to.equal(peerA);

      controller.dispose();
    });
  });

  e.describe('Controller.listen', (e) => {
    e.it('start listening to a P2P network - ["local:peer" + crdt.doc<shared>]', async (e) => {
      const self = peerA;

      controller = WebRtcController.listen(self, stateDoc, {
        filedir,
        dispose$,
        onConnectStart(e) {
          // console.log('onConnectStart', e);
        },
        onConnectComplete(e) {
          // console.log('onConnectComplete', e);
        },
      });

      // await rx.firstValueFrom(waiter.dispose$);
    });

    e.it('[success] connect peer: A → B (initiated by A)', async (e) => {
      const self = peerA.id;
      const remote = peerB.id;
      const wait = rx.firstValueFrom(controller.connect.complete$);

      /**
       * Adding peer to document (CRDT) initiates the
       * controller's connection sequence.
       */
      stateDoc.change((d) => {
        const initiatedBy = self;
        Mutate.addPeer(d.network, self, remote, { initiatedBy });
      });

      await wait;
      const doc = stateDoc.current;
      const p1 = doc.network.peers[self];
      const p2 = doc.network.peers[remote];

      expect(p1.initiatedBy).to.eql(self);
      expect(p2.initiatedBy).to.eql(self);

      expect(p1.error).to.eql(undefined);
      expect(p2.error).to.eql(undefined);

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

    e.it('[fail] connect peer: A → FOO-404', async (e) => {
      const self = peerA.id;
      const remote = 'FOO-404';

      const errors: t.PeerError[] = [];
      controller.errors.peer$.subscribe((e) => errors.push(e));

      /**
       * Adding peer to document (CRDT) initiates the
       * controller's connection sequence.
       */
      stateDoc.change((d) => {
        const initiatedBy = self;
        Mutate.addPeer(d.network, self, remote, { initiatedBy });
      });
      expect(stateDoc.current.network.peers[remote].initiatedBy).to.eql(self);

      await rx.firstValueFrom(controller.errors.peer$);
      expect(errors.length).to.eql(1);
      expect(errors[0].type === 'peer-unavailable').to.eql(true);

      await Time.wait(10);
      const doc = stateDoc.current;
      const p2 = doc.network.peers[remote];
      expect(p2.error).to.include(errors[0].message);
      expect(p2.error).to.include('[peer-unavailable]');
    });

    e.it.skip('events$: connect:start → connect:complete', async (e) => {});

    e.it.skip('meta: userAgent added to {peers} state', async (e) => {
      // expect(res.peer.meta.userAgent).to.eql(UserAgent.current);
    });

    e.it('info (← via event-bus)', async (e) => {
      const info = await controller.info.get();
      expect(info?.module.name).to.eql(Pkg.name);
      expect(info?.module.version).to.eql(Pkg.version);
      expect(info?.peer).to.equal(peerA);
      expect(typeof info?.state.peers === 'object').to.eql(true);
    });

    e.it('kill peer-B → auto removed from peer-A state doc', async (e) => {
      const remote = peerB.id;
      expect(stateDoc.current.network.peers[remote]).to.exist;

      peerB.dispose(); // Kill the peer.
      await Time.wait(500);
      expect(stateDoc.current.network.peers[remote]).to.not.exist;
    });

    e.it('prune dead peers', async (e) => {
      const state = Crdt.Doc.ref<DocShared>(initialState, { dispose$ });
      state.change((d) => Mutate.addPeer(d.network, 'A', 'B', { initiatedBy: 'A' }));

      expect(state.current.network.peers['B']).to.exist;

      const res = await pruneDeadPeers(peerA, state);
      expect(res.removed).to.eql(['B']);
      expect(state.current.network.peers['B']).to.not.exist;
    });

    e.it('dispose', async (e) => {
      // dispose();
      /**
       * TODO 🐷
       * - dispose of controller
       * - listen for dispose$ event
       */
    });
  });
});
