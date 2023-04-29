import type { t } from '../common.t';

/**
 * Representation of a conversational network (P2P)
 */
export type NetworkState = { peers: NetworkStatePeers };
export type NetworkStatePeers = { [key: string]: NetworkStatePeer };
export type NetworkStatePeer = {
  id: t.PeerId;
  tx?: string;
  initiatedBy?: t.PeerId;
  device: NetworkStateDevice;
  error?: string;
};

export type NetworkStateDevice = {
  userAgent?: t.UserAgent;
};

/**
 * Controller
 */
export type NetworkSharedDoc = { network: t.NetworkState };
export type NetworkSharedDocRef = t.CrdtDocRef<t.NetworkSharedDoc>;
