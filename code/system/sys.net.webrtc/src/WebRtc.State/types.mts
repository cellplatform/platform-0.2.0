import type { t } from '../common.t';

export type WebRtcState<N extends string = string> = {
  readonly kind: 'WebRtc:State';
  readonly doc: t.NetworkDocSharedRef;
  readonly current: t.NetworkDocShared;
  props<T extends {}>(namespace: N, initial: T): t.WebRtcStateLens<T>;
};

/**
 * Lens for operating on a namespaced sub-tree within
 * the shared network {props}.
 */
export type WebRtcStateLens<T extends {}> = t.CrdtLens<t.NetworkDocShared, T>;
