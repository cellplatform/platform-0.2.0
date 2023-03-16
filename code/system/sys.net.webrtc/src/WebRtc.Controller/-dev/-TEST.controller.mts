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

type DocShared = {
  network: t.NetworkState;
};

export default Dev.describe('Controller (CRDT)', async (e) => {
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

  e.describe('Controller.listen', (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    e.it('init: create peers A ⇔ B', async (e) => {
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

    e.it('start listening to a P2P network - ["local:peer" + crdt.doc<shared>]', async (e) => {
      const self = peerA;

      controller = WebRtcController.listen(self, stateDoc, {
        filedir,
        dispose$,
        onConnectStart(e) {
          // state.change((d) => (d.props.spinning = true));
          console.log('onConnectStart', e);
        },
        onConnectComplete(e) {
          // state.change((d) => (d.props.spinning = false));
          console.log('onConnectComplete', e);
        },
      });

      // await rx.firstValueFrom(waiter.dispose$);
    });

    e.it('connect peer: A → B (initiated by A)', async (e) => {
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

      console.log('-------------------------------------------');
      console.log('doc', toObject(doc.network));
    });

    e.it.skip('events$: connect:start → connect:complete', async (e) => {});

    e.it.skip('meta: userAgent added to {peers} state', async (e) => {
      // expect(res.peer.meta.userAgent).to.eql(UserAgent.current);
    });

    e.it.skip('remove peer', async (e) => {});
    e.it.skip('purge stale/dead peers', async (e) => {});

    e.it('info (← via event-bus)', async (e) => {
      const info = await controller.info.get();
      expect(info?.module.name).to.eql(Pkg.name);
      expect(info?.module.version).to.eql(Pkg.version);
      expect(info?.peer).to.equal(peerA);
      expect(typeof info?.state.peers === 'object').to.eql(true);
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
