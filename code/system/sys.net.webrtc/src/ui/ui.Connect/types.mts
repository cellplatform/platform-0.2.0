import { type t } from './common';

export type ConnectProps = {
  edge?: t.Edge;
  fields?: t.WebRtcInfoField[];
  data?: t.WebRtcInfoData;
  client?: t.WebRtcEvents;
  card?: boolean;
  style?: t.CssValue;
};

export type ConnectStatefulProps = {
  self?: t.Peer;
  edge?: t.Edge;
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
