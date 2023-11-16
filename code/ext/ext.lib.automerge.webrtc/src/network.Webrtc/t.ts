import type { t } from './common';
export type { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

export type * from './t.Message';

export type WebrtcStore = t.Lifecycle & {
  readonly store: t.Store;
  readonly peer: t.PeerModel;
  readonly total: { readonly added: number };
  readonly added$: t.Observable<WebrtcStoreNetworkAdapterAdded>;
};

export type WebrtcStoreNetworkAdapterAdded = {
  conn: { id: string; obj: t.DataConnection };
  adapter: t.WebrtcNetworkAdapter;
};
