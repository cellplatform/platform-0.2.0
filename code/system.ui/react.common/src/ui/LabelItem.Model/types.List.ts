import type { t } from './common';

type O = Record<string, unknown>;
type ItemId = string;
type Index = number;

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
    readonly blur$: t.Observable<void>;
    readonly select$: t.Observable<t.LabelListSelect>;
  };
};

/**
 * Commands
 * (events as a property stream)
 */
export type LabelListDispatch = {
  focus(focus?: boolean): void;
  blur(): void;
  select(item: Index | ItemId, focus?: boolean): void;
};

export type LabelListCmd = LabelListFocusCmd | LabelListSelectCmd;

export type LabelListFocusCmd = { type: 'List:Focus'; payload: LabelListFocus };
export type LabelListFocus = { focus: boolean; tx: string };

export type LabelListSelectCmd = { type: 'List:Select'; payload: LabelListSelect };
export type LabelListSelect = { item: Index | ItemId; focus: boolean; tx: string };
