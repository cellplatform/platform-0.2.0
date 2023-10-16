import type { t } from './common';

type Id = string;
type Index = number;
type O = Record<string, unknown>;

/**
 * List
 */

/**
 * Context for when an item exists
 * within the context of a list.
 */
export type LabelList<D extends O = O> = {
  total: number;
  getItem?: GetLabelItem;
  selected?: Id;
  focused?: boolean;
  cmd?: t.LabelListCmd; // Used to produce an event stream of commands.
  data?: D;


export type LabelListState<D extends O = O> = t.PatchState<t.LabelList<D>, t.LabelListEvents<D>>;

/**
 * Events API
 */
export type LabelListEvents<D extends O = O> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelList<D>>>;
  readonly cmd: {
    readonly $: t.Observable<t.LabelListCmd>;
    readonly redraw$: t.Observable<t.LabelListRedraw>;
    readonly select$: t.Observable<t.LabelListSelect>;
    readonly focus$: t.Observable<void>;
    readonly blur$: t.Observable<void>;
  };
};

/**
 * Commands
 * (events as a property stream)
 */
export type LabelListDispatch = {
  select(item: Index | Id, focus?: boolean): void;
  redraw(item?: Index | Id): void;
  focus(focus?: boolean): void;
  blur(): void;
};

export type LabelListCmd = LabelListFocusCmd | LabelListSelectCmd | LabelListRedrawCmd;

export type LabelListFocusCmd = { type: 'List:Focus'; payload: LabelListFocus };
export type LabelListFocus = { focus: boolean; tx: string };

export type LabelListSelectCmd = { type: 'List:Select'; payload: LabelListSelect };
export type LabelListSelect = { item: Index | Id; focus: boolean; tx: string };

export type LabelListRedrawCmd = { type: 'List:Redraw'; payload: LabelListRedraw };
export type LabelListRedraw = { item?: Index | Id; tx: string };
