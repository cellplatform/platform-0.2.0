import type { t } from './common';

export type EditorUpdateStrategy = 'Splice' | 'Overwrite';

export type EditorPaths = {
  text: t.ObjectPath;
  identity: t.ObjectPath;
};

export type EditorIdentityState = {
  selection?: t.Selection;
};

/**
 * A sync-listener instance.
 */
export type SyncListener = t.Lifecycle & {
  readonly identity: string;
  readonly strategy: EditorUpdateStrategy;
};
