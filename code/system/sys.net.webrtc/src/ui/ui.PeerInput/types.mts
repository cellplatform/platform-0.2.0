import type { t } from '../common.t';

export type PeerInputField = 'Peer:Remote' | 'Peer:Self' | 'Video';

export type PeerInputProps = {
  self?: t.Peer;
  remote?: t.PeerId;
  enabled?: boolean;
  spinning?: boolean;
  fields?: t.PeerInputField[];
  video?: MediaStream;
  muted?: boolean;
  style?: t.CssValue;
  onLocalCopied?: t.PeerCardLocalCopiedHandler;
  onRemoteChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};
