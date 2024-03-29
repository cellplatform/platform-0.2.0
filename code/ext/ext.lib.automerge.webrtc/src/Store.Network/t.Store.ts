import type { t } from './common';

type Uri = string;

export type NetworkStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly total: t.NetworkStoreTotals;
  events(dispose$?: t.UntilObservable): t.WebrtcStoreEvents;
  shared(): Promise<NetworkStoreShared>;
};

export type NetworkStoreShared = t.OmitLifecycle<t.CrdtSharedState>;

export type NetworkStoreTotals = {
  readonly added: number;
  readonly bytes: { readonly in: number; readonly out: number };
};

export type NetworkStoreConnectMetadata = t.PeerConnectMetadata & { shared: Uri };
