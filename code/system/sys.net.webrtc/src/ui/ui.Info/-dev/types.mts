import { t } from '../../common.t';

export type * from '../../common/types.mjs';

/**
 * Test Runner
 */
export type TDevRunnerCtx = {
  props: t.WebRtcPropsLens<TDevSharedProps>;
  overlay(el: JSX.Element | null): Promise<void>;
};

/**
 * Shared
 */
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

  youtubeId?: string;
  youtubeVisible?: boolean;
  youtubePlaying?: boolean;
  youtubeMuted?: boolean;
};

export type TDevSharedPropsLens = t.WebRtcPropsLens<TDevSharedProps>;
