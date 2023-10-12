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

/**
 * Controller API's
 */
export type LabelItemController<Kind extends string> = {
  readonly kind: Kind;
  readonly enabled: boolean;
  readonly current: t.LabelItem;
  readonly handlers: t.LabelItemPropsHandlers;
};

export type LabelListController<Kind extends string, H extends HTMLElement> = {
  readonly kind: Kind;
  readonly ref: React.RefObject<H>;
  readonly enabled: boolean;
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
