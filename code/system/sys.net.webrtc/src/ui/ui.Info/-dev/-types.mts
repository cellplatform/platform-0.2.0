import { t } from '../../common.t';

export type * from '../../common/types.mjs';

/**
 * Test Runner
 */
export type TDevRunnerCtx = {
  props: t.WebRtcPropsLens<TDevSharedProps>;
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
  fields?: t.WebRtcInfoField[];

  imageShow?: boolean;
  imageBinary?: t.ImageBinary;
};

export type TDevSharedPropsLens = t.WebRtcPropsLens<TDevSharedProps>;
