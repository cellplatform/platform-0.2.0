import type { t } from '../common.t';

export type WebRtcController = t.Lifecycle & {
  state: t.WebRtcState;
  client(dispose$?: t.Observable<any>): t.WebRtcEvents;
  withClient(fn: (client: t.WebRtcEvents) => any): Promise<void>;
};

/**
 * Representation of a conversational network (P2P)
 */
export type NetworkState = {
  peers: NetworkStatePeers;
  props: NetworkStateProps;
};

/**
 * Peers
 */
export type NetworkStatePeers = { [key: string]: NetworkStatePeer };
export type NetworkStatePeer = {
  id: t.PeerId;
  tx?: string; // The transaction-id of the operation that initiated the peer (NB: used for response event capture).
  initiatedBy?: t.PeerId;
  error?: string;
  conns: NetworkStatePeerConnections;
  device: NetworkStateDevice;
};

export type NetworkStatePeerConnections = {
  /**
   * NB: The "main" connection is the primary connection used for data transfer.
   *     and is assumed to exist as the baseline default resource of each peer.
   */
  mic?: boolean;
  video?: boolean;
  screen?: boolean;
};

export type NetworkStateDevice = {
  userAgent?: t.UserAgent;
};

/**
 * Shared Properties
 */
export type NetworkStateProps = { [namespace: string]: Record<string, unknown> };

/**
 * Controller
 */
export type NetworkDocSharedRef = t.CrdtDocRef<t.NetworkDocShared>;
