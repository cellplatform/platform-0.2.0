import type { t } from './common';

type O = Record<string, unknown>;
type ItemId = string;

/**
 * List
 */

/**
 * Context for when an item exists
 * within the context of a list.
 */
export type LabelList<D extends O = O> = {
  selected?: ItemId;
  focused?: boolean;
  cmd?: t.LabelListCmd; // Used to produce an event stream of commands.
  data?: D;
};

export type LabelListState<D extends O = O> = t.PatchState<
  t.LabelList<D>,
  t.LabelListStateEvents<D>
>;

/**
 * Events API
 */
export type LabelListStateEvents<D extends O = O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelList<D>>>;
  readonly cmd: {
    readonly $: t.Observable<t.LabelListCmd>;
  };
};

/**
 * Commands
 * (events as a property stream)
 */
export type LabelListCmd = LabelListCmdFocus;

export type LabelListCmdFocus = { type: 'List:Focus'; payload: { tx: string } };

// TEMP 🐷
type FOO__ = { type: 'TMP:FOO'; payload: {} };
