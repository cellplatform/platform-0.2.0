import type { t } from './common';
export type { WebrtcNetworkAdapter } from './NetworkAdapter';

type Id = string;
type Uri = string;

export type WebrtcStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndex;
  readonly syncdoc?: t.DocRefHandle<t.WebrtcSyncDoc>;
  readonly total: t.WebrtcStoreTotals;
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly added$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.WebrtcMessageAlert>;
  readonly syncdoc$: t.Observable<t.WebrtcStoreSyncdocChanged>;
};

export type WebrtcStoreTotals = {
  readonly added: number;
  readonly bytes: { in: number; out: number };
};

export type WebrtcStoreConnectMetadata = t.PeerConnectMetadata & { syncdoc: Uri };

/**
 * Events
 */
export type WebrtcStoreEvent =
  | WebrtcStoreAdapterAddedEvent
  | WebrtcStoreMessageEvent
  | WebrtcStoreSyncdocChangedEvent;

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

export type WebrtcStoreSyncdocChangedEvent = {
  type: 'crdt:webrtc/SyncDoc';
  payload: WebrtcStoreSyncdocChanged;
};
export type WebrtcStoreSyncdocChanged = {
  change: t.DocChanged<t.WebrtcSyncDoc>;
};
