import type { t } from './common';

/**
 * Events API
 */
export type CrdtSharedEvents = t.Lifecycle & {
  readonly $: t.Observable<t.CrdtSharedEvent>;
  readonly changed$: t.Observable<t.CrdtSharedChanged>;
};

/**
 * Events
 */
export type CrdtSharedEvent = CrdtSharedChangedEvent;

/**
 * Fired when the shared doc changes.
 */
export type CrdtSharedChangedEvent = {
  type: 'crdt:webrtc:shared/Changed';
  payload: t.CrdtSharedChanged;
};
export type CrdtSharedChanged = t.DocChanged<t.CrdtShared>;
