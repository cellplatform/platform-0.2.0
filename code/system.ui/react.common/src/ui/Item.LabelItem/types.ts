import type { t } from './common';

export type LabelItemPosition = { index: number; total: number };

/**
 * An "action" represented as a clickable icon button.
 */
export type LabelActionKind = string;
export type LabelAction<K extends LabelActionKind = string> = {
  kind: K;
  width?: number;
  enabled?: boolean;
  spinning?: boolean;
  button?: boolean;
};

/**
 * JSX Renderer (data → visuals)
 */
export type LabelItemRendered = JSX.Element | undefined | false;
export type LabelItemRenderer = (e: LabelItemRendererArgs) => LabelItemRendered;
export type LabelItemRendererArgs = LabelItemValueArgs & { color: string };

export type LabelItemValueArgs = {
  index: number;
  total: number;
  enabled: boolean;
  editing: boolean;
  selected: boolean;
  focused: boolean;
  item: t.LabelItem;
};

export type LabelItemRenderers<A extends LabelActionKind = string> = {
  label?: t.LabelItemRenderer;
  placeholder?: t.LabelItemRenderer;
  action?(kind: A, helpers: LabelItemActionRenderHelpers): t.LabelItemRenderer | void;
};

export type LabelItemActionRenderHelpers = {
  opacity(e: t.LabelItemRendererArgs): number;
  icon(
    e: t.LabelItemRendererArgs,
    size?: t.IconProps['size'],
    offset?: t.IconProps['offset'],
  ): t.IconProps;
};

/**
 * Component (View)
 */
export type LabelItemProps = {
  index?: number;
  total?: number;

  item?: t.LabelItem;
  renderers?: t.LabelItemRenderers;

  selected?: boolean;
  focused?: boolean;

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

export type LabelItemPropsHandlers = {
  onReady?: LabelItemReadyHandler;
  onEditChange?: LabelItemChangeHandler;
  onKeyDown?: LabelItemKeyHandler;
  onKeyUp?: LabelItemKeyHandler;
  onFocusChange?: LabelItemFocusHandler;
  onClick?: LabelItemClickHandler;
  onLabelDoubleClick?: LabelItemClickHandler;
  onEditClickAway?: LabelItemClickHandler;
  onActionClick?: t.LabelItemActionHandler;
};

/**
 * ref={ ƒ }
 */
export type LabelItemRef = {
  focus(): void;
  blur(): void;
  selectAll(): void;
  selectAll(): void;
  cursorToStart(): void;
  cursorToEnd(): void;
};

/**
 * Events
 */
export type LabelItemReadyHandler = (e: LabelItemReadyHandlerArgs) => void;
export type LabelItemReadyHandlerArgs = {
  position: LabelItemPosition;
  ref: LabelItemRef;
};

export type LabelItemChangeHandler = (e: LabelItemChangeHandlerArgs) => void;
export type LabelItemChangeHandlerArgs = {
  position: LabelItemPosition;
  label: string;
};

export type LabelItemActionHandler = (e: LabelItemActionHandlerArgs) => void;
export type LabelItemActionHandlerArgs = {
  position: LabelItemPosition;
  kind: LabelActionKind;
  focused: boolean;
  selected: boolean;
  editing: boolean;
};

export type LabelItemKeyHandler = (e: LabelItemKeyHandlerArgs) => void;
export type LabelItemKeyHandlerArgs = {
  position: LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  code: string;
  is: t.KeyboardKeyFlags;
  keypress: t.KeyboardKeypressProps;
};

export type LabelItemFocusHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemFocusHandlerArgs = {
  position: LabelItemPosition;
  focused: boolean;
};

export type LabelItemClickHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  position: LabelItemPosition;
  focused: boolean;
  selected: boolean;
  editing: boolean;
};
