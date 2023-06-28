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
  overlay?: 'sys.data.project' | 'sys.data.crdt' | 'sys.ui.image' | null;

  fullscreenVideo?: boolean;
  cardFlipped?: boolean;
  fields?: t.WebRtcInfoField[];
};

export type TDevSharedPropsLens = t.WebRtcPropsLens<TDevSharedProps>;
