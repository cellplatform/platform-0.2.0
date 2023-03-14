import { TEST, WebRtc, t, rx } from './common';

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
    const log = true;
    const wait = Array.from({ length }).map(() => WebRtc.peer(signal, { getStream, log }));
    return (await Promise.all(wait)) as t.Peer[];
  },

  /**
   * Generate a simple 2-node connected network.
   */
  async init() {
    const { dispose, dispose$ } = rx.disposable();
    const media = WebRtc.Media.singleton({});
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
          wait.push(peerA.data(peerB.id, { name: 'Test Network' }));
          wait.push(WebRtc.Util.waitFor.nextDataConnection(peerB));
        }

        if (kind.includes('media')) {
          wait.push(peerA.media(peerB.id, 'camera'));
          wait.push(WebRtc.Util.waitFor.nextMediaConnection(peerB));
        }

        await Promise.all(wait);
      },
    };

    return api;
  },
};
