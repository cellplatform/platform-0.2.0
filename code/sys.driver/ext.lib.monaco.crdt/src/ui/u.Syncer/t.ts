import type { t } from './common';

export type * from './t.Cmd';
export type * from './t.Editor';

/**
 * A sync-listener instance.
 */
export type SyncListener = t.Lifecycle & {
  readonly cmd: t.SyncCmdMethods;
  readonly identity: string;
  readonly strategy: t.EditorUpdateStrategy;
  readonly changed: t.SyncListenerChanged;
  purge(): Promise<t.SyncPurgeResponse>;
};

export type SyncListenerChanged = {
  readonly identity$: t.Observable<t.EditorIdentityStateChange>;
};

export type SyncPurgeResponse = {
  total: { identities: number; alive: number; dead: number };
  alive: string[];
  dead: string[];
};
