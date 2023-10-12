import type { t } from './common';

type O = Record<string, unknown>;

export type LabelItemBehaviorKind =
  | 'Item'
  | 'Item.Selection'
  | 'Item.Edit'
  | 'List'
  | 'List.Navigation';

/**
 * Item (Data Model)
 */
export type LabelItem<A extends t.LabelActionKind = string, D extends O = O> = {
  label?: string;
  placeholder?: string;
  enabled?: boolean;
  editing?: boolean;
  editable?: boolean;
  command?: LabelItemCommand; // Produces an event stream of commands when changed.
  left?: t.LabelAction<A> | t.LabelAction<A>[] | null;
  right?: t.LabelAction<A> | t.LabelAction<A>[] | null;
  data?: D;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState<A extends t.LabelActionKind = string, D extends O = O> = t.ImmutableRef<
  t.LabelItem<A, D>,
  t.LabelItemStateEvents<A, D>
>;

export type LabelItemStateEvents<
  A extends t.LabelActionKind = string,
  D extends O = O,
> = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelItem<A, D>>>;
  readonly key: {
    readonly $: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly enter$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly escape$: t.Observable<t.LabelItemKeyHandlerArgs>;
  };
  readonly cmd: {
    readonly $: t.Observable<t.LabelItemCommand>;
    readonly redraw$: t.Observable<void>;
    readonly changed$: t.Observable<t.LabelItemChanged>;
    readonly click$: t.Observable<t.LabelItemClick>;
    readonly action: {
      readonly $: t.Observable<t.LabelItemActionInvoked>;
      on(...kind: A[]): t.Observable<t.LabelItemActionInvoked<A>>;
    };
    readonly clipboard: {
      readonly $: t.Observable<t.LabelItemClipboard>;
      readonly cut$: t.Observable<t.LabelItemClipboard>;
      readonly copy$: t.Observable<t.LabelItemClipboard>;
      readonly paste$: t.Observable<t.LabelItemClipboard>;
    };
  };
};

/**
 * Controller API's
 */
export type LabelItemController<Kind extends string> = {
  readonly kind: Kind;
  readonly enabled: boolean;
  readonly current: t.LabelItem;
  readonly handlers: t.LabelItemPropsHandlers;
};

/**
 * Component (View).
 */
export type LabelItemStatefulProps = {
  index?: number;
  total?: number;
  list?: t.LabelListState;
  item?: t.LabelItemState;
  renderers?: t.LabelItemRenderers;
  useBehaviors?: t.LabelItemBehaviorKind[];
  renderCount?: t.RenderCountProps;
  debug?: boolean;
  style?: t.CssValue;
  onChange?: LabelItemStateChangeHandler;
};

/**
 * Events.
 */
export type LabelItemStateChangeHandler = (e: LabelItemStateChangeHandlerArgs) => void;
export type LabelItemStateChangeHandlerArgs = {
  readonly action: LabelItemChangeAction;
  readonly position: t.LabelItemPosition;
  readonly item: LabelItem;
};
export type LabelItemChangeAction =
  | 'ready'
  | 'label'
  | 'selected'
  | 'unselected'
  | 'edit:start'
  | 'edit:accept'
  | 'edit:cancel';

/**
 * Commands (events as property stream)
 */
export type LabelItemCommand =
  | LabelItemKeydownCommand
  | LabelItemKeyupCommand
  | LabelItemClipboardCommand
  | LabelItemRedrawCommand
  | LabelItemActionInvokedCommand
  | LabelItemClickCommand
  | LabelItemChangedCommand;

export type LabelItemKeydownCommand = { type: 'Item:Keydown'; payload: LabelItemKeypress };
export type LabelItemKeyupCommand = { type: 'Item:Keyup'; payload: LabelItemKeypress };
export type LabelItemKeypress = t.LabelItemKeyHandlerArgs & { tx: string };

export type LabelItemClipboardCommand = { type: 'Item:Clipboard'; payload: LabelItemClipboard };
export type LabelItemClipboard = { action: 'Cut' | 'Copy' | 'Paste'; tx: string };

export type LabelItemRedrawCommand = { type: 'Item:Redraw'; payload: LabelItemRedraw };
export type LabelItemRedraw = { tx: string };

export type LabelItemActionInvokedCommand<K extends t.LabelActionKind = string> = {
  type: 'Item:Action';
  payload: LabelItemActionInvoked<K>;
};
export type LabelItemActionInvoked<K extends t.LabelActionKind = string> = {
  kind: K;
  position: t.LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  tx: string;
};

export type LabelItemClickCommand = { type: 'Item:Click'; payload: LabelItemClick };
export type LabelItemClick = t.LabelItemClickHandlerArgs & { tx: string };

export type LabelItemChangedCommand = { type: 'Item:Changed'; payload: LabelItemChanged };
export type LabelItemChanged = t.LabelItemStateChangeHandlerArgs & { tx: string };
