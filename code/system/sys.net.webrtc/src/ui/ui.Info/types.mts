import type { t } from '../common.t';

export type WebRtcInfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Self.Id'
  | 'State.Shared'
  | 'Group'
  | 'Group.Peers';

export type WebRtcInfoData = {
  events?: t.WebRtcEvents;
  self?: { title?: string };
  peers?: { title?: string };
  state?: { shared?: { title?: string } };
};
