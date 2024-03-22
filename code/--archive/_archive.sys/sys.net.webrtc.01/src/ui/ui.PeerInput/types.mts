import type { t } from '../common.t';

export type PeerInputField = 'Peer:Remote' | 'Peer:Self' | 'Video';

/**
 * Component
 */
export type PeerInputProps = {
  self?: t.Peer;
  remote?: t.PeerId;
  enabled?: boolean;
  spinning?: boolean;
  fields?: t.PeerInputField[];
  copiedMessage?: string;
  video?: MediaStream;
  muted?: boolean;
  config?: Partial<t.PeerInputConfigButton>;
  style?: t.CssValue;

  onLocalCopied?: t.PeerCardLocalCopiedHandler;
  onRemoteChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
  onConfigClick?: t.PeerInputConfigClickHandler;
};

/**
 * The configuration toggle button.
 */
export type PeerInputConfigButton = {
  visible: boolean;
  selected: boolean;
};

/**
 * Events
 */
export type PeerInputConfigClickHandler = (e: PeerInputConfigClickHandlerArgs) => void;
export type PeerInputConfigClickHandlerArgs = { config: t.PeerInputConfigButton };
