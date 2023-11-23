import type { t } from './common';
export type { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';
export type * from './t.Message';

type Id = string;

export type WebrtcStore = t.Lifecycle & {
  readonly store: t.Store;
  readonly peer: t.PeerModel;
  readonly total: { readonly added: number; readonly bytes: number };
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly add$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.WebrtcMessage>;
};

/**
 * Events
 */
export type WebrtcStoreEvent = WebrtcStoreAdapterAddedEvent | WebrtcStoreMessageEvent;

export type WebrtcStoreAdapterAddedEvent = {
  type: 'crdt:webrtc/AdapterAdded';
  payload: WebrtcStoreAdapterAdded;
};
export type WebrtcStoreAdapterAdded = {
  peer: Id;
  conn: { id: Id; obj: t.DataConnection };
  adapter: t.WebrtcNetworkAdapter;
};

export type WebrtcStoreMessageEvent = {
  type: 'crdt:webrtc/Message';
  payload: t.WebrtcMessage;
};
