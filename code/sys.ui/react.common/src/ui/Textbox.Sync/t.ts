import type { t } from './common';

type O = Record<string, unknown>;
export type TextboxSyncState = t.ImmutableRef<O, t.ImmutableEvents<O, unknown>, unknown>;

/**
 * A live listener that is syncing an <input> textbox
 * with a CRDT document.
 */
export type TextboxSyncListener = t.Lifecycle & {
  onChange(fn: TextboxSyncChangeHandler): TextboxSyncListener;
};

/**
 * Events
 */
export type TextboxSyncChangeHandler = (e: TextboxSyncChangeHandlerArgs) => void;
export type TextboxSyncChangeHandlerArgs = {
  readonly text: string;
  readonly pos: t.Index;
};
