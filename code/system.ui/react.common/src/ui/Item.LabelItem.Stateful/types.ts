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
export type LabelItem = {
  label?: string;
  placeholder?: string;
  editing?: boolean;
  enabled?: boolean;
  left?: t.LabelAction | t.LabelAction[];
  right?: t.LabelAction | t.LabelAction[];
  is?: { editable?: t.LabelItemValue<boolean> };
  cmd?: LabelItemCommand; // Produces an event stream of commands when changed.
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
  readonly cmd$: t.Observable<t.LabelItemCommand>;
  readonly keydown$: t.Observable<t.LabelItemKeyHandlerArgs>;
  readonly keyboard: {
    readonly copy$: t.Observable<t.LabelItemKeyHandlerArgs>;
    readonly paste$: t.Observable<t.LabelItemKeyHandlerArgs>;
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
  item?: t.LabelItemState;
  list?: t.LabelItemListState;
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
  | LabelItemTestCommand
  | LabelItemKeydownCommand
  | LabelItemKeyupCommand;

export type LabelItemTestCommand = {
  type: 'Item:Test';
  payload: { msg?: string; count: number };
};
export type LabelItemKeydownCommand = {
  type: 'Item:Keydown';
  payload: t.LabelItemKeyHandlerArgs;
};
export type LabelItemKeyupCommand = {
  type: 'Item:Keyup';
  payload: t.LabelItemKeyHandlerArgs;
};
