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
