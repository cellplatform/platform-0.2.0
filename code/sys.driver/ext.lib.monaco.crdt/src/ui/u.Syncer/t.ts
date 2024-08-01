import type { t } from './common';

export type * from './t.Cmd';
export type * from './t.Editor';

/**
 * A sync-listener instance.
 */
export type SyncListener = t.Lifecycle & {
  readonly identity: string;
  readonly strategy: t.EditorUpdateStrategy;
};
