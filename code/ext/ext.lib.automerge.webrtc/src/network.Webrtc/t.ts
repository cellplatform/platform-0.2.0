import type { t } from './common';
export type { WebrtcNetworkAdapter } from './Webrtc.NetworkAdapter';

export type * from './t.Message';

export type WebrtcStoreManager = t.Lifecycle & {
  readonly added$: t.Observable<WebrtcStoreManagerAdded>;
  readonly total: { readonly added: number };
};

export type WebrtcStoreManagerAdded = {
  conn: { id: string; obj: t.DataConnection };
  adapter: t.WebrtcNetworkAdapter;
};
