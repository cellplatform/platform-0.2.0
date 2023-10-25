import type { t } from './common';

type Id = string;
type Index = number;
type O = Record<string, unknown>;

/**
 * Model for a list of <Item>'s.
 */
export type LabelList<D extends O = O> = {
  total: number;
  getItem?: t.GetLabelItem;
  getRenderers?: t.GetLabelItemRenderers;
  selected?: Id;
  editing?: Id;
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
  readonly total$: t.Observable<number>;
  readonly selected$: t.Observable<Id>;
  readonly cmd: {
    readonly $: t.Observable<t.LabelListCmd>;
    readonly redraw$: t.Observable<t.LabelListRedrawCmdArgs>;
    readonly select$: t.Observable<t.LabelListSelectCmdArgs>;
    readonly remove$: t.Observable<t.LabelListRemoveCmdArgs>;
    readonly focus$: t.Observable<void>;
    readonly blur$: t.Observable<void>;
  };
};

/**
 * Event Commands
 * (events as a property stream)
 */
export type LabelListDispatch = {
  select(item: Index | Id, focus?: boolean): void;
  redraw(item?: Index | Id): void;
  remove(item?: Index | Id): void;
  focus(focus?: boolean): void;
  blur(): void;
};

export type LabelListCmd =
  | LabelListFocusCmd
  | LabelListSelectCmd
  | LabelListRedrawCmd
  | LabelListRemoveCmd;

export type LabelListFocusCmd = { type: 'List:Focus'; payload: LabelListFocusCmdArgs };
export type LabelListFocusCmdArgs = { focus: boolean; tx: string };

export type LabelListSelectCmd = { type: 'List:Select'; payload: LabelListSelectCmdArgs };
export type LabelListSelectCmdArgs = { item: Index | Id; focus: boolean; tx: string };

export type LabelListRedrawCmd = { type: 'List:Redraw'; payload: LabelListRedrawCmdArgs };
export type LabelListRedrawCmdArgs = { item?: Index | Id; tx: string };

export type LabelListRemoveCmd = { type: 'List:Remove'; payload: LabelListRemoveCmdArgs };
export type LabelListRemoveCmdArgs = { item?: Index | Id; tx: string };
