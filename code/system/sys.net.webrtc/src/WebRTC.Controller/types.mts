import type { t } from '../common.t';

export type ControlledDoc = { network: t.NetworkState };

/**
 * Representation of a conversational network (P2P)
 */
export type NetworkState = {
  peers: NetworkStatePeers;
};

export type NetworkStatePeers = { [key: string]: NetworkStatePeer };
export type NetworkStatePeer = {
  id: t.PeerId;
  initiatedBy?: t.PeerId;
  device: NetworkStateDevice;
  error?: string;
};

export type NetworkStateDevice = {
  userAgent?: t.UserAgent;
};
