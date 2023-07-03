import type { t } from '../common.t';

export type ConnectInputField = 'Peer:Remote' | 'Peer:Self' | 'Video';

export type ConnectInputProps = {
  self?: t.Peer;
  remote?: t.PeerId;
  spinning?: boolean;
  fields?: t.ConnectInputField[];
  video?: MediaStream;
  muted?: boolean;
  style?: t.CssValue;
  onLocalCopied?: t.PeerCardLocalCopiedHandler;
  onRemoteChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};
