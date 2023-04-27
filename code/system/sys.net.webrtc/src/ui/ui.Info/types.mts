import type { t } from '../common.t';

export type WebRtcInfoFields =
  | 'Module'
  | 'Module.Verify'
  | 'Self'
  | 'Connections'
  | 'Connetions.List';

export type WebRtcInfoData = {
  self?: { peer: t.Peer; title?: string };
  connections?: { title?: string };
};
