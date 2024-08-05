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
};

export type SyncListenerChanged = {
  readonly identity$: t.Observable<t.EditorIdentityStateChange>;
};
