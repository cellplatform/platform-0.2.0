import { t } from '../../common.t';
export type * from '../../common/types.mjs';

export type TDevRemote = {
  name: string;
  peer: t.Peer;
  controller: t.WebRtcController;
  client: t.WebRtcEvents;
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
  vimeoId?: string;
  vimeoVisible?: boolean;
  vimeoPlaying?: boolean;
  vimeoMuted?: boolean;
};

export type TDevSharedPropsLens = t.WebRtcStateLens<TDevSharedProps>;
