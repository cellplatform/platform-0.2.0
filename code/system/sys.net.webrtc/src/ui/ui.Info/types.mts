import type { t } from '../common.t';

export type WebRtcInfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Self.Id'
  | 'State.Shared'
  | 'Group'
  | 'Group.Peers'
  | 'Peer'
  | 'Peer.Connections';

export type WebRtcInfoData = {
  self?: { title?: string };
  peer?: { title?: string };
  group?: { title?: string };
  state?: { shared?: { title?: string } };
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
  kind: t.WebRtcInfoPeerFacet;
  peerid: t.PeerId;
  is: { spinning: boolean; disabled: boolean; off: boolean };
};
