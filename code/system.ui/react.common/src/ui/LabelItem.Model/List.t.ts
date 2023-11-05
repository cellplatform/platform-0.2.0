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
    readonly edit$: t.Observable<t.LabelListEditCmdArgs>;
    readonly remove$: t.Observable<t.LabelListRemoveCmdArgs>;
    readonly focus$: t.Observable<void>;
    readonly blur$: t.Observable<void>;
  };
  item(
    id: Id,
    dispose$?: t.UntilObservable,
  ): {
    selected$: t.Observable<boolean>;
  };
};

/**
 * Event Commands
 * (events as a property stream)
 */
export type LabelListDispatch = {
  select(item: Index | Id, focus?: boolean): void;
  edit(item: Index | Id, action?: t.LabelListEditCmdArgs['action']): void;
  redraw(item?: Index | Id): void;
  remove(index?: Index): void;
  focus(focus?: boolean): void;
  blur(): void;
};

export type LabelListCmd =
  | LabelListFocusCmd
  | LabelListSelectCmd
  | LabelListRedrawCmd
  | LabelListRemoveCmd
  | LabelListEditCmd;

export type LabelListFocusCmd = { type: 'List:Focus'; payload: LabelListFocusCmdArgs };
export type LabelListFocusCmdArgs = { tx: string; focus: boolean };

export type LabelListSelectCmd = { type: 'List:Select'; payload: LabelListSelectCmdArgs };
export type LabelListSelectCmdArgs = { tx: string; item: Index | Id; focus: boolean };

export type LabelListRedrawCmd = { type: 'List:Redraw'; payload: LabelListRedrawCmdArgs };
export type LabelListRedrawCmdArgs = { tx: string; item?: Index | Id };

export type LabelListRemoveCmd = { type: 'List:Remove'; payload: LabelListRemoveCmdArgs };
export type LabelListRemoveCmdArgs = { tx: string; index: Index };

export type LabelListEditCmd = { type: 'List:Edit'; payload: LabelListEditCmdArgs };
export type LabelListEditCmdArgs = {
  tx: string;
  item: Id;
  action: t.LabelItemEditCmdArgs['action'];
};
