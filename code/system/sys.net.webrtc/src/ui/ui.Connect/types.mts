import { type t } from './common';

export type ConnectEdge = 'Top' | 'Bottom';

export type ConnectProps = {
  edge?: ConnectEdge;
  data?: t.WebRtcInfoData;
  style?: t.CssValue;
};

export type ConnectStatefulProps = {
  self?: t.Peer;
  edge?: ConnectEdge;
  style?: t.CssValue;
  onChange?: ConnectStatefulChangedHandler;
};

/**
 * Events
 */
export type ConnectStatefulChangedHandler = (e: ConnectStatefulChangedHandlerArgs) => void;
export type ConnectStatefulChangedHandlerArgs = {
  data: t.WebRtcInfoData;
};
