import type { t } from '../../common.t';

export type OnPeerConnectRequestHandler = (e: OnPeerConnectRequestHandlerArgs) => void;
export type OnPeerConnectRequestHandlerArgs = {
  peer: t.PeerId;
  kind: t.PeerConnectionKind;
};
