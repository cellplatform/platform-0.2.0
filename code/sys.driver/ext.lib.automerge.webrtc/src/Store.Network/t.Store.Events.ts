import type { t } from './common';

type Id = string;

/**
 * Events API
 */
export type WebrtcStoreEvents = t.Lifecycle & {
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly added$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.NetworkMessageAlert>;
  readonly peer: t.OmitLifecycle<t.PeerModelEvents>;
  readonly shared: t.OmitLifecycle<t.CrdtSharedEvents>;
};

/**
 * Events
 */
export type WebrtcStoreEvent =
  | WebrtcStoreAdapterAddedEvent
  | WebrtcStoreMessageEvent
  | t.CrdtSharedEvent;

export type WebrtcStoreAdapterAddedEvent = {
  type: 'crdt:net:webrtc/AdapterAdded';
  payload: WebrtcStoreAdapterAdded;
};
export type WebrtcStoreAdapterAdded = {
  peer: { local: Id; remote: Id };
  conn: { id: Id };
};

export type WebrtcStoreMessageEvent = {
  type: 'crdt:net:webrtc/Message';
  payload: t.NetworkMessageAlert;
};
