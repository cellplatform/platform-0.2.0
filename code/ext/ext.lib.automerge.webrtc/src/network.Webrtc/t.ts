import { type t } from './common';

export type * from './t.Message';

type ConnectionId = string;

export type WebrtcStoreManager = t.Lifecycle & {
  readonly added$: t.Observable<ConnectionId>;
  readonly total: { readonly added: number };
};
