import type { t } from './common';

export type EditorUpdateStrategy = 'Splice' | 'Overwrite';
export type EditorPaths = {
  text: t.ObjectPath;
  selection: t.ObjectPath;
};

/**
 * A sync-listener instance.
 */
export type SyncListener = t.Lifecycle & {
  readonly strategy: EditorUpdateStrategy;
};
