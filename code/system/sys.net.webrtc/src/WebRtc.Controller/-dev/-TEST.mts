import { WebRtcController } from '..';
import {
  Time,
  expect,
  Automerge,
  Crdt,
  Dev,
  Filesystem,
  R,
  rx,
  t,
  TestNetwork,
  Pkg,
} from '../../test.ui';

import { initialCommit as initialCommitData } from './initial.data.mjs';

type DocShared = {
  network: t.NetworkState;
};

export default Dev.describe('Controller', async (e) => {

  const { dispose, dispose$ } = rx.disposable();

  const Mutate = WebRtcController.Mutate;
  const bus = rx.bus();
  const fs = (await Filesystem.client({ bus, dispose$ })).fs;
  const filedir = fs.dir('dev.test.WebRtc.Controller');

  const initialState: DocShared = { count: 0, network: { peers: {} } };
  const state = Crdt.Doc.ref<DocShared>(initialState, { dispose$ });

  e.describe('Controller.listen', (e) => {
    let peerA: t.Peer;
    let peerB: t.Peer;

    e.it('init: create peers A ⇔ B', async (e) => {
      const [a, b] = await TestNetwork.peers(2, { getStream: true });
      peerA = a;
      peerB = b;
    });

    e.it('start listening to a P2P network - ["local:peer" + crdt.doc<shared>]', async (e) => {
      const self = peerA;

      // console.log('network', network);

      WebRtcController.listen({
        self,
        state,
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

      // console.log('res', res);
      //

      /**
       * TODO 🐷
       */
      //
    });

    e.it('add peers: A ← B (initiated by self)', async (e) => {
      const self = peerA.id;
      const remote = peerB.id;

      state.change((d) => {
        Mutate.addPeer(d.network, self, remote, { initiatedBy: self });
      });

      console.log('state.doc.current', state.current);
    });

    e.it.skip('events$: connect:start → connect:complete', async (e) => {});
    e.it.skip('remove peer', async (e) => {});
    e.it.skip('purge stale/dead peers', async (e) => {});

    e.it('info', async (e) => {
      const info = await controller.info.get();
      expect(info?.module.name).to.eql(Pkg.name);
      expect(info?.module.version).to.eql(Pkg.version);
      expect(info?.peer.id).to.eql(peerA.id);
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
