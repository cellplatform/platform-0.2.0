import type { t } from '../common.t';

/**
 * Representation of a conversational network (P2P)
 */
export type NetworkState = { peers: NetworkStatePeers };
export type NetworkStatePeers = { [key: string]: NetworkStatePeer };
export type NetworkStatePeer = {
  id: t.PeerId;
  tx?: string; // The transaction-id of the operation that initiated the peer.
  initiatedBy?: t.PeerId;
  device: NetworkStateDevice;
  // connections: {
  //   main: NetworkStatePeerData;
  // };
  error?: string;
};

// export type NetworkStatePeerData = { tx: string };

export type NetworkStateDevice = {
  userAgent?: t.UserAgent;
};

/**
 * Controller
 */
export type NetworkDocSharedRef = t.CrdtDocRef<t.NetworkDocShared>;
