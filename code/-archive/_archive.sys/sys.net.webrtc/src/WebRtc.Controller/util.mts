import { type t, WebRtcUtils } from './common';
import { Mutate } from '../WebRtc.State/State.Mutate.mjs';

/**
 * Examine the health of each peer and disconnect if required.
 */
export async function pruneDeadPeers(self: t.Peer, state: t.NetworkDocSharedRef) {
  const peers = state.current.network.peers ?? {};
  const removed: t.PeerId[] = [];

  const wait = Object.values(peers).map(async (peer) => {
    const isAlive = await WebRtcUtils.isAlive(self, peer.id);
    if (!isAlive) {
      state.change((d) => Mutate.removePeer(d.network, peer.id));
      removed.push(peer.id);
    }
  });

  await Promise.all(wait);
  return { removed };
}
