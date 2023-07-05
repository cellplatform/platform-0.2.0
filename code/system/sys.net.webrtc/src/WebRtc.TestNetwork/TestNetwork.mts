import { WebRtc } from '../WebRtc';
import { DEFAULTS, cuid, rx, type t } from './common';

/**
 * Helpers for working with test P2P networks.
 */
export const TestNetwork = {
  /**
   * Single peer network setup.
   */
  async peer(options: { log?: boolean } = {}) {
    const [self] = await TestNetwork.peers(1, { getStream: true, log: options.log });
    return self;
  },

  /**
   * Generate sample peers.
   */
  async peers(
    length: number,
    options: {
      log?: boolean;
      getStream?: t.PeerGetMediaStream | boolean;
      dispose$?: t.Observable<any>;
    } = {},
  ) {
    const { dispose$ } = options;
    const getStream = Wrangle.getStream(options);
    const signal = DEFAULTS.signal;
    const log = options.log;
    const wait = Array.from({ length }).map((_, i) => {
      // const id = `p${i + 1}-${cuid()}`;
      const id = cuid();
      return WebRtc.peer(signal, { id, getStream, log, dispose$ });
    });
    return (await Promise.all(wait)) as t.Peer[];
  },

  /**
   * Generate a simple 2-node connected network.
   */
  async init(options: { log?: boolean; dispose$?: t.Observable<any> } = {}) {
    const { dispose, dispose$ } = rx.disposable();
    const [peerA, peerB] = await TestNetwork.peers(2, {
      log: options.log,
      getStream: true,
      dispose$,
    });

    const api: t.TestNetworkP2P = {
      peerA,
      peerB,
      dispose,
      dispose$,
      async connect(kind: t.PeerConnectionKind[] = ['data', 'media']) {
        let wait: Promise<any>[] = [];

        if (kind.includes('data')) {
          wait.push(peerA.data(peerB.id));
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

/**
 * Helpers
 */

export const Wrangle = {
  getStream(options: { getStream?: t.PeerGetMediaStream | boolean } = {}) {
    if (options.getStream === true) return WebRtc.Media.singleton({}).getStream;
    if (typeof options.getStream === 'function') return options.getStream;
    return undefined;
  },
};
