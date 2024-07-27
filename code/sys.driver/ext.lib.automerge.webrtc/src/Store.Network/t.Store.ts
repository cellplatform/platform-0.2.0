import type { t } from './common';

export type NetworkStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndex;
  readonly total: t.NetworkStoreTotals;
  readonly shared: NetworkStoreShared;
  events(dispose$?: t.UntilObservable): t.WebrtcStoreEvents;
};

export type NetworkStoreShared = t.OmitLifecycle<t.CrdtSharedState>;

export type NetworkStoreTotals = {
  readonly added: number;
  readonly bytes: { readonly in: number; readonly out: number };
};

export type NetworkStoreConnectMetadata = t.PeerConnectMetadata & { shared: t.UriString };
