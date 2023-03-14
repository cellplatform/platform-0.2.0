import { t } from './common';

/**
 * Helpers for mutating the state data.
 *
 * IMPORTANT:
 *    Only pass the proxy state safely from within an
 *    immutable CRDT 'change' handler.
 */
export const Mutate = {
  /**
   * Add a peer to the network if it does not already exist.
   */
  addPeer(
    data: t.NetworkState,
    self: t.PeerId,
    subject: t.PeerId,
    options: { initiatedBy?: t.PeerId } = {},
  ) {
    const { initiatedBy } = options;
    const peers = Wrangle.peers(data);
    const exists = Boolean(peers[subject]);
    const isSelf = self === subject;

    const done = () => {
      const peer = peers[subject];
      return { peer, existing: exists, isSelf };
    };

    const setContext = (peer: t.NetworkStatePeer) => {
      if (initiatedBy) peer.initiatedBy = initiatedBy;
      if (isSelf) {
        peer.meta.useragent = navigator.userAgent;
      }
    };

    if (exists) {
      const peer = peers[subject];
      setContext(peer);
      return done();
    }

    const peer: t.NetworkStatePeer = {
      id: subject,
      meta: {},
    };

    setContext(peer);
    peers[peer.id] = peer;
    return done();
  },

  removePeer(data: t.NetworkState, subject: t.PeerId) {
    const peers = Wrangle.peers(data);
    const peer = peers[subject];
    const existing = Boolean(peer);
    if (existing) delete data.peers[subject];
    return { existing, peer };
  },
};

/**
 * Helpers
 */

const Wrangle = {
  peers(data: t.NetworkState) {
    return data.peers ?? (data.peers = {});
  },
};
