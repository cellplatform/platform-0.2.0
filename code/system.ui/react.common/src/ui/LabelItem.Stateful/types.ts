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
  list?: t.LabelListState;
  item?: t.LabelItemState;
  renderers?: t.LabelItemRenderers;
  useBehaviors?: t.LabelItemBehaviorKind[];
  renderCount?: t.RenderCountProps;
  debug?: boolean;
  style?: t.CssValue;
} & t.LabelItemPropsHandlers;

/**
 * (Hook) List context.
 */
export type LabelListContext = {
  readonly list: t.LabelList;
  readonly dispatch: t.LabelListDispatch;
  events(dispose$?: t.UntilObservable): t.LabelListEvents;
};

/**
 * Events.
 */
export type LabelItemStateChangedHandler = (e: LabelItemStateChangedHandlerArgs) => void;
export type LabelItemStateChangedHandlerArgs = {
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
