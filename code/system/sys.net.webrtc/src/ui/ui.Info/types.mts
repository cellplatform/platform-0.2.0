import type { t } from '../common.t';

export type WebRtcInfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Self.Id'
  | 'State.Shared'
  | 'Peers'
  | 'Peers.List';

export type WebRtcInfoData = {
  events?: t.WebRtcEvents;
  self?: { peer: t.Peer; title?: string };
  peers?: { title?: string };
  state?: { shared?: { title?: string } };
};
