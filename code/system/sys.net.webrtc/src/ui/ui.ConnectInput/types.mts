import type { t } from '../common.t';

export type ConnectInputProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  showPeer?: boolean;
  showConnect?: boolean;
  spinning?: boolean;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
  onRemotePeerChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};
