import type { t } from '../common.t';

export type WebRtcInfoFields =
  | 'Module'
  | 'Module.Verify'
  | 'Self'
  | 'State.Shared'
  | 'Peers'
  | 'Peers.List';

export type WebRtcInfoData = {
  events?: t.WebRtcEvents;
  self?: { peer: t.Peer; title?: string };
  peers?: { title?: string };
  state?: { shared?: { title?: string } };
};
