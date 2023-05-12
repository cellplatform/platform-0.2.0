import type { t } from '../common.t';

/**
 * Representation of a conversational network (P2P)
 */
export type NetworkState = { peers: NetworkStatePeers };
export type NetworkStatePeers = { [key: string]: NetworkStatePeer };
export type NetworkStatePeer = {
  id: t.PeerId;
  tx?: string; // The transaction-id of the operation that initiated the peer (NB: used for response event capture).
  initiatedBy?: t.PeerId;
  device: NetworkStateDevice;
  connections: NetworkStatePeerConnections;
  error?: string;
};

export type NetworkStatePeerConnections = {
  /**
   * NB: The "main" connection is the primary connection used for data transfer.
   *     and is assumed to exist as the baseline default resource of each peer.
   */
};

export type NetworkStateDevice = {
  userAgent?: t.UserAgent;
};

/**
 * Controller
 */
export type NetworkDocSharedRef = t.CrdtDocRef<t.NetworkDocShared>;
