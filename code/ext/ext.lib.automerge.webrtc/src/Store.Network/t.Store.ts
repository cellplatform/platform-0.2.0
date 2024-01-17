import type { t } from './common';
export type { WebrtcNetworkAdapter } from './NetworkAdapter';

type Uri = string;

export type WebrtcStore = t.Lifecycle & {
  readonly peer: t.PeerModel;
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly total: t.WebrtcStoreTotals;
  events(dispose$?: t.UntilObservable): t.WebrtcStoreEvents;

  readonly shared: {
    readonly $: t.Observable<t.CrdtSharedChanged>; // TEMP 🐷
    readonly doc?: t.DocRef<t.CrdtShared>;
    namespace<N extends string = string>(): t.NamespaceManager<t.CrdtShared['ns'], N> | undefined;
  };
};

export type WebrtcStoreTotals = {
  readonly added: number;
  readonly bytes: { in: number; out: number };
};

export type WebrtcStoreConnectMetadata = t.PeerConnectMetadata & { shared: Uri };
