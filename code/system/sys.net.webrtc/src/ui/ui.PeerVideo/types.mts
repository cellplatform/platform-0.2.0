import type { t } from '../../common.t';

export type PeerVideoRemoteChangedHandler = (e: PeerVideoRemoteChangedHandlerArgs) => void;
export type PeerVideoRemoteChangedHandlerArgs = { local: t.PeerId; remote: t.PeerId };

export type PeerVideoLocalCopiedHandler = (e: PeerVideoLocalCopiedHandlerArgs) => void;
export type PeerVideoLocalCopiedHandlerArgs = { local: t.PeerId };

export type PeerVideoConnectRequestHandler = (e: PeerVideoConnectRequestHandlerArgs) => void;
export type PeerVideoConnectRequestHandlerArgs = { local: t.PeerId; remote: t.PeerId };

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
  meta: NetworkStatePeerMeta;
};

export type NetworkStatePeerMeta = {
  useragent?: string;
};
