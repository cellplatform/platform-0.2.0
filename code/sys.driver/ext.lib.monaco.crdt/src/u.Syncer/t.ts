import type { t } from './common';

export type UpdateTextStrategy = 'Splice' | 'Overwrite';

/**
 * A sync-listener instance.
 */
export type SyncListener = t.Lifecycle & {
  readonly strategy: UpdateTextStrategy;
};
