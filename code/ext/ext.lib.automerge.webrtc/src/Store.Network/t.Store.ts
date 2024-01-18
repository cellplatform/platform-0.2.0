import type { t } from './common';
export type { WebrtcNetworkAdapter } from './NetworkAdapter';

type Uri = string;

export type WebrtcStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly total: t.WebrtcStoreTotals;
  events(dispose$?: t.UntilObservable): t.WebrtcStoreEvents;
  shared(): Promise<t.OmitLifecycle<t.CrdtSharedState>>;
};

export type WebrtcStoreTotals = {
  readonly added: number;
  readonly bytes: { in: number; out: number };
};

export type WebrtcStoreConnectMetadata = t.PeerConnectMetadata & { shared: Uri };
