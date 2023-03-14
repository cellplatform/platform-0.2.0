import { t } from './common';

/**
 * Helpers for mutating the state data.
 *
 * IMPORTANT:
 *    Only pass the proxy state safely from within an
 *    immutable CRDT 'change' handler.
 */
export const Mutate = {
  addPeer(
    data: t.NetworkState,
    self: t.PeerId,
    subject: t.PeerId,
    options: { initiatedBy?: t.PeerId } = {},
  ) {
    const { initiatedBy } = options;
    const peers = Wrangle.peers(data);
    const exists = Boolean(peers[subject]);
    const isMe = self === subject;

    if (exists) return { peer: peers[subject], existing: true };

    console.log('ADD PEER=============');
    console.log('data', data);
    console.log('peers', peers);
    console.log('isMe', isMe);

    const peer: t.NetworkStatePeer = {
      id: subject,
      meta: {},
    };

    if (initiatedBy) peer.initiatedBy = initiatedBy;
    if (isMe) {
      peer.meta.useragent = navigator.userAgent;
    }

    console.group('🌳 ADD');
    console.log('peer.id', peer.id);
    console.log('peer', peer);
    console.log('peers', peers);
    console.log('isMe', isMe);
    console.log('initiatedBy', initiatedBy);
    console.groupEnd();

    peers[peer.id] = peer;
    return { peer, existing: false };
  },

  removePeer(data: t.NetworkState, subject: t.PeerId) {
    const peers = Wrangle.peers(data);
    const exists = Boolean(peers[subject]);
    if (exists) delete data.peers[subject];
    return { existing: exists };
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
