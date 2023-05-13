import { t } from '../../common.t';
export type * from '../../common/types.mjs';

export type TDevRemote = {
  name: string;
  peer: t.Peer;
  controller: t.WebRtcController;
  events: t.WebRtcEvents;
};
