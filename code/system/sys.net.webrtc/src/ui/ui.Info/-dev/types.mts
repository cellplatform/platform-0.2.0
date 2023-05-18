import { t } from '../../common.t';
export type * from '../../common/types.mjs';

export type TDevRemote = {
  name: string;
  peer: t.Peer;
  controller: t.WebRtcController;
  events: t.WebRtcEvents;
};

export type TDevSharedProps = {
  count: number;
  showRight?: boolean;
  fullscreenVideo?: boolean;
  cardFlipped?: boolean;
  fields?: t.WebRtcInfoField[];
  imageUrl?: string;
  imageVisible?: boolean;
  imageFit?: 'cover' | 'contain';
};

export type TDevSharedPropsLens = t.WebRtcStateLens<TDevSharedProps>;
