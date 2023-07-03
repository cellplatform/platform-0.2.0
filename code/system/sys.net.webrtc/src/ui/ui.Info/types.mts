import type { t } from '../common.t';

export type WebRtcInfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Self.Id'
  | 'State.Shared'
  | 'Group'
  | 'Group.Peers'
  | 'Peer'
  | 'Peer.Connections'
  | 'Connect.Top'
  | 'Connect.Bottom';

export type WebRtcInfoData = {
  self?: { title?: string };
  state?: { shared?: { title?: string } };
  peer?: { title?: string };
  group?: WebRtcInfoDataGroup;
};

export type WebRtcInfoDataGroup = {
  title?: string;
  selected?: t.PeerId;
  useController?: boolean;
  onPeerSelect?: WebRtcInfoPeerRowSelectHandler;
  onPeerCtrlClick?: WebRtcInfoPeerCtrlsClickHandler;
};

export type WebRtcInfoPeerFacet = 'Mic' | 'Video' | 'Screen' | 'Identity' | 'StateDoc';

/**
 * Event: Peer row selected.
 */
export type WebRtcInfoPeerRowSelectHandler = (e: WebRtcInfoPeerRowSelectArgs) => void;
export type WebRtcInfoPeerRowSelectArgs = { peerid: t.PeerId };

/**
 * Event: Peer control (action) clicked
 */
export type WebRtcInfoPeerCtrlsClickHandler = (e: WebRtcInfoPeerCtrlsClickArgs) => void;
export type WebRtcInfoPeerCtrlsClickArgs = {
  kind: t.WebRtcInfoPeerFacet | 'Close';
  peerid: t.PeerId;
  is: { self: boolean; spinning: boolean; disabled: boolean; off: boolean };
};
