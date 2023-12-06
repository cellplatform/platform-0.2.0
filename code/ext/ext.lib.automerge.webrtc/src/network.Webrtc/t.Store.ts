import type { t } from './common';
export type { WebrtcNetworkAdapter } from './NetworkAdapter';

type Id = string;

export type WebrtcStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndex;
  readonly ephemeral: t.DocRefHandle<t.WebrtcSyncDoc>;
  readonly total: t.WebrtcStoreTotals;
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly added$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.WebrtcMessageAlert>;
};

export type WebrtcStoreTotals = {
  readonly added: number;
  readonly bytes: { in: number; out: number };
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
  conn: { id: Id; obj: t.PeerJsConnData };
  adapter: t.WebrtcNetworkAdapter;
};

export type WebrtcStoreMessageEvent = {
  type: 'crdt:webrtc/Message';
  payload: t.WebrtcMessageAlert;
};
