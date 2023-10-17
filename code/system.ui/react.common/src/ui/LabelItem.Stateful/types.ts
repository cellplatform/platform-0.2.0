import type { t } from './common';

export type LabelItemBehaviorKind =
  | 'Item'
  | 'Item.Selection'
  | 'Item.Edit'
  | 'List'
  | 'List.Navigation';

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

export type LabelListContext = {
  readonly list: t.LabelList;
  readonly dispatch: t.LabelListDispatch;
  events(dispose$?: t.UntilObservable): t.LabelListEvents;
};

/**
 * Events.
 */
export type LabelItemStateChangeHandler = (e: LabelItemStateChangeHandlerArgs) => void;
export type LabelItemStateChangeHandlerArgs = {
  readonly action: LabelItemChangeAction;
  readonly position: t.LabelItemPosition;
  readonly item: t.LabelItem;
};
export type LabelItemChangeAction =
  | 'ready'
  | 'label'
  | 'selected'
  | 'unselected'
  | 'edit:start'
  | 'edit:accept'
  | 'edit:cancel';
