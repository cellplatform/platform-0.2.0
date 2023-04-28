import type { t } from '../common.t';

export type ConnectInputFields = 'Peer:Remote' | 'Peer:Self' | 'Video:Self';

export type ConnectInputProps = {
  self?: t.Peer;
  remotePeer?: t.PeerId;
  spinning?: boolean;
  fields?: t.ConnectInputFields[];
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
  onRemotePeerChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};
