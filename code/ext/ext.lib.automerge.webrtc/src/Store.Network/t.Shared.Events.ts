import type { t } from './common';

/**
 * Events API
 */
export type CrdtSharedEvents = t.Lifecycle & {
  readonly $: t.Observable<t.CrdtSharedEvent>;
  readonly ready$: t.Observable<t.CrdtSharedState>;
  readonly changed$: t.Observable<t.CrdtSharedChanged>;
};

/**
 * Events
 */
export type CrdtSharedEvent = CrdtSharedReadyEvent | CrdtSharedChangedEvent;

export type CrdtSharedReadyEvent = {
  type: 'crdt:webrtc:shared/Ready';
  payload: t.CrdtSharedState;
};

export type CrdtSharedChangedEvent = {
  type: 'crdt:webrtc:shared/Changed';
  payload: t.CrdtSharedChanged;
};
export type CrdtSharedChanged = t.DocChanged<t.CrdtShared>;
