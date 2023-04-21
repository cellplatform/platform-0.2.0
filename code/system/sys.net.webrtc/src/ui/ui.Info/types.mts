import type { t } from '../common.t';

export type WebRtcInfoFields = 'Module' | 'Module.Verify' | 'Self';

export type WebRtcInfoData = {
  self?: { peer: t.Peer; title?: string };
};
