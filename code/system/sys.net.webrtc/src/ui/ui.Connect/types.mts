import { type t } from './common';

export type ConnectProps = {
  edge?: t.VEdge;
  fields?: t.WebRtcInfoField[];
  client?: t.WebRtcEvents;
  info?: t.WebRtcInfoData;
  card?: boolean;
  copiedMessage?: string;
  style?: t.CssValue;
};

export type ConnectStatefulProps = {
  self?: t.Peer;
  edge?: t.VEdge;
  card?: boolean;
  style?: t.CssValue;
  onChange?: ConnectChangedHandler;
};

/**
 * Events
 */
export type ConnectChangedHandler = (e: ConnectChangedHandlerArgs) => void;
export type ConnectChangedHandlerArgs = {
  readonly client: t.WebRtcEvents;
  readonly selected?: t.PeerId;
};
