import type { t } from '../common.t';

export type WebRtcState = t.Lifecycle & {
  readonly kind: 'WebRtc:State';
  readonly doc: t.NetworkDocSharedRef;
};
