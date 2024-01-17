import type { t } from './common';

type Id = string;

/**
 * Events API
 */
export type WebrtcStoreEvents = t.Lifecycle & {
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly added$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.WebrtcMessageAlert>;
  readonly peer: Omit<t.PeerModelEvents, 'dispose' | 'dispose$' | 'disposed'>;
};

/**
 * Events
 */
export type WebrtcStoreEvent =
  | WebrtcStoreAdapterAddedEvent
  | WebrtcStoreMessageEvent
  | t.CrdtSharedChangedEvent;

export type WebrtcStoreAdapterAddedEvent = {
  type: 'crdt:webrtc/AdapterAdded';
  payload: WebrtcStoreAdapterAdded;
};
export type WebrtcStoreAdapterAdded = {
  peer: { local: Id; remote: Id };
  conn: { id: Id };
};

export type WebrtcStoreMessageEvent = {
  type: 'crdt:webrtc/Message';
  payload: t.WebrtcMessageAlert;
};
