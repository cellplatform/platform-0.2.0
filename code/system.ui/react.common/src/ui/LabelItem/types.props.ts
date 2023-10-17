import { type t } from './common';

/**
 * Component (View)
 */
export type LabelItemProps = {
  total?: number;
  index?: number;
  id?: string;
  item?: t.LabelItem;
  renderers?: t.LabelItemRenderers;

  focused?: boolean;
  selected?: boolean;
  editing?: boolean;

  focusOnReady?: boolean;
  focusOnEdit?: boolean;
  tabIndex?: number;
  maxLength?: number;
  debug?: boolean;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;
  borderRadius?: number;
  renderCount?: t.RenderCountProps;
} & LabelItemPropsHandlers;

/**
 * Component: Event Callback Handlers
 */
export type LabelItemPropsHandlers = {
  onReady?: t.LabelItemReadyHandler;
  onEditChange?: t.LabelItemChangeHandler;
  onKeyDown?: t.LabelItemKeyHandler;
  onKeyUp?: t.LabelItemKeyHandler;
  onFocusChange?: t.LabelItemFocusHandler;
  onClick?: t.LabelItemClickHandler;
  onDoubleClick?: t.LabelItemClickHandler;
  onLabelDoubleClick?: t.LabelItemClickHandler;
  onEditClickAway?: t.LabelItemClickHandler;
  onActionClick?: t.LabelItemActionHandler;
};
