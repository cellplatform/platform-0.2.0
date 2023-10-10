import type { t } from './common';

type ItemId = string;

export type LabelItemBehaviorKind =
  | 'Item'
  | 'Item.Selection'
  | 'Item.Edit'
  | 'List'
  | 'List.Navigation';

/**
 * Item (Data Model)
 */
export type LabelItem<A extends t.LabelActionKind = string> = {
  label?: string;
  placeholder?: string;
  enabled?: boolean;
  editing?: boolean;
  command?: LabelItemCommand; // Produces an event stream of commands when changed.
  is?: { editable?: boolean };
  left?: t.LabelAction<A> | t.LabelAction<A>[] | null;
  right?: t.LabelAction<A> | t.LabelAction<A>[] | null;
};

/**
 * Context for when an item exists
 * within the context of a list.
 */
export type LabelItemList = {
  selected?: ItemId;
  focused?: boolean;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState = t.ImmutableRef<t.LabelItem, t.LabelItemStateEvents>;
export type LabelItemStateEvents = t.Lifecycle & {
  readonly $: t.Observable<t.PatchChange<t.LabelItem>>;
  readonly key: {
    readonly $: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly enter$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly escape$: t.Observable<t.LabelItemKeyHandlerArgs>;
  };
  readonly command: {
    readonly $: t.Observable<t.LabelItemCommand>;
    readonly redraw$: t.Observable<string>;
    readonly clipboard: {
      readonly $: t.Observable<t.LabelItemClipboard>;
      readonly cut$: t.Observable<t.LabelItemClipboard>;
      readonly copy$: t.Observable<t.LabelItemClipboard>;
      readonly paste$: t.Observable<t.LabelItemClipboard>;
    };
    readonly action: {
      $: t.Observable<t.LabelItemActionInvoked>;
      kind<K extends t.LabelActionKind>(...kind: K[]): t.Observable<t.LabelItemActionInvoked<K>>;
    };
  };
};

/**
 * List
 */
export type LabelItemListState = t.PatchState<t.LabelItemList>;

/**
 * Controller API's
 */
export type LabelItemController<Kind extends string> = {
  readonly kind: Kind;
  readonly enabled: boolean;
  readonly data: t.LabelItem;
  readonly handlers: t.LabelItemPropsHandlers;
};

export type LabelListController<Kind extends string, H extends HTMLElement> = {
  readonly kind: Kind;
  readonly ref: React.RefObject<H>;
  readonly enabled: boolean;
};

/**
 * Component (View).
 */
export type LabelItemStatefulProps = {
  index?: number;
  total?: number;
  list?: t.LabelItemListState;
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
  readonly data: LabelItem;
};
export type LabelItemChangeAction =
  | 'ready'
  | 'label'
  | 'selected'
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
  | LabelItemActionInvokedCommand;

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
