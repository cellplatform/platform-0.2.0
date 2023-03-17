import type { t } from '../../common.t';

/**
 * Request a new connection.
 */
export type PeerListConnectReqHandler = (e: PeerListConnectReqHandlerArgs) => void;
export type PeerListConnectReqHandlerArgs = {
  peer: t.PeerId;
  kind: 'data' | 'media:camera' | 'media:screen';
};

export type PeerListDisplayConnReqHandler = (e: PeerListDisplayConnReqHandlerArgs) => void;
export type PeerListDisplayConnReqHandlerArgs = {
  connection: t.PeerConnectionId;
};
