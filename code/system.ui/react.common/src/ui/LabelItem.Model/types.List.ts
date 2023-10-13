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

export type LabelListState<D extends O = O> = t.PatchState<t.LabelList<D>, t.LabelListEvents<D>>;

/**
 * Events API
 */
export type LabelListEvents<D extends O = O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelList<D>>>;
  readonly cmd: {
    readonly $: t.Observable<t.LabelListCmd>;
    readonly focus$: t.Observable<void>;
  };
};

/**
 * Commands
 * (events as a property stream)
 */
export type LabelListDispatch = {
  focus(): void;
};

export type LabelListCmd = LabelListCmdFocus;
export type LabelListCmdFocus = { type: 'List:Focus'; payload: { tx: string } };
