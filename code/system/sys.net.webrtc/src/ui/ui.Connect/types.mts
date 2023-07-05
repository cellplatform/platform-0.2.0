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
  onChange?: ConnectStatefulChangedHandler;
};

/**
 * Events
 */
export type ConnectStatefulChangedHandler = (e: ConnectStatefulChangedHandlerArgs) => void;
export type ConnectStatefulChangedHandlerArgs = {
  self: t.Peer;
  data: t.WebRtcInfoData;
  client: t.WebRtcEvents;
};
