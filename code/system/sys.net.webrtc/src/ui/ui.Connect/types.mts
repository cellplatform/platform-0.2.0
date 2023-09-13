import { type t } from './common';

export type Common = {
  edge?: t.VEdge;
  fields?: t.WebRtcInfoField[];
  showInfo?: boolean;
  showInfoAsCard?: boolean;
  showInfoToggle?: boolean;
  style?: t.CssValue;
  margin?: t.CssEdgesInput;
  onInfoToggle?: t.ConnectToggleInfoHandler;
};

export type ConnectProps = Common & {
  client?: t.WebRtcEvents;
  info?: t.WebRtcInfoData;
  loading?: boolean;
  copiedMessage?: string;
};

export type ConnectStatefulProps = Common & {
  self?: t.Peer;
  onReady?: ConnectReadyHandler;
  onChange?: ConnectChangedHandler;
  onNetwork?: t.ConnectNetworkHandler;
};

/**
 * Events
 */
export type ConnectReadyHandler = (e: ConnectReadyHandlerArgs) => void;
export type ConnectReadyHandlerArgs = {
  readonly client: t.WebRtcEvents;
  readonly info: t.WebRtcInfo;
};

export type ConnectChangedHandler = (e: ConnectChangedHandlerArgs) => void;
export type ConnectChangedHandlerArgs = {
  readonly client: t.WebRtcEvents;
  readonly selected?: t.PeerId;
};

export type ConnectNetworkHandler = (e: ConnectNetworkHandlerArgs) => void;
export type ConnectNetworkHandlerArgs = {
  readonly current: t.NetworkDocShared;
};

export type ConnectToggleInfoHandler = (e: ConnectToggleInfoHandlerArgs) => void;
export type ConnectToggleInfoHandlerArgs = {
  readonly showing: boolean;
};
