import { TEST, WebRTC, t, rx } from './common';

export type TestNetworkP2P = t.Disposable & {
  peerA: t.Peer;
  peerB: t.Peer;
  connect(kind?: t.PeerConnectionKind[]): Promise<void>;
};

/**
 * Helpers for working with test P2P networks.
 */
export const TestNetwork = {
  /**
   * Generate sample peers.
   */
  async peers(length: number = 2, getStream?: t.PeerGetMediaStream) {
    const signal = TEST.signal;
    const wait = Array.from({ length }).map(() => WebRTC.peer(signal, { getStream }));
    return (await Promise.all(wait)) as t.Peer[];
  },

  /**
   * Generate a simple 2-node connected network.
   */
  async p2p() {
    const { dispose, dispose$ } = rx.disposable();
    const media = WebRTC.Media.singleton({});
    const [peerA, peerB] = await TestNetwork.peers(2, media.getStream);

    dispose$.subscribe(() => {
      peerA.dispose();
      peerB.dispose();
    });

    const api: TestNetworkP2P = {
      peerA,
      peerB,
      dispose,
      dispose$,
      async connect(kind: t.PeerConnectionKind[] = ['data', 'media']) {
        let wait: Promise<any>[] = [];

        if (kind.includes('data')) {
          wait.push(peerA.data(peerB.id, { name: 'Sample' }));
          wait.push(WebRTC.Util.waitFor.nextDataConnection(peerB));
        }

        if (kind.includes('media')) {
          wait.push(peerA.media(peerB.id, 'camera'));
          wait.push(WebRTC.Util.waitFor.nextMediaConnection(peerB));
        }

        await Promise.all(wait);
      },
    };

    return api;
  },
};
