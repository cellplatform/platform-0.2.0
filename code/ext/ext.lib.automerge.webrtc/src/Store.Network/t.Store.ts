import type { t } from './common';
export type { WebrtcNetworkAdapter } from './NetworkAdapter';

type Id = string;
type Uri = string;

export type WebrtcStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly total: t.WebrtcStoreTotals;
  readonly $: t.Observable<t.WebrtcStoreEvent>;
  readonly added$: t.Observable<t.WebrtcStoreAdapterAdded>;
  readonly message$: t.Observable<t.WebrtcMessageAlert>;
  readonly shared: {
    readonly $: t.Observable<t.CrdtSharedChanged>;
    readonly doc?: t.DocRef<t.CrdtShared>;
    namespace<N extends string = string>(): t.NamespaceManager<t.CrdtShared['ns'], N> | undefined;
  };
};

export type WebrtcStoreTotals = {
  readonly added: number;
  readonly bytes: { in: number; out: number };
};

export type WebrtcStoreConnectMetadata = t.PeerConnectMetadata & { shared: Uri };

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
