import { type t } from './common';

export type LabelItemPosition = { index: number; total: number };

/**
 * An "action" represented as a clickable icon button.
 */
export type LabelActionKind = string;
export type LabelAction<K extends LabelActionKind = string> = {
  kind: K;
  width?: number;
  element?: LabelActionRender | JSX.Element | false;
  enabled?: LabelItemValue<boolean>;
  spinning?: LabelItemValue<boolean>;
  onClick?: LabelItemActionHandler;
};

/**
 * JSX Renderer.
 */
export type LabelActionRender = (args: LabelActionRenderArgs) => JSX.Element;
export type LabelActionRenderArgs = LabelItemDynamicValueArgs & { color: string };

/**
 * Values (explicit or dynamic).
 */
export type LabelItemValue<T> = T | LabelItemDynamicValue<T>;
export type LabelItemDynamicValue<T> = (e: LabelItemDynamicValueArgs) => T;
export type LabelItemDynamicValueArgs = {
  index: number;
  total: number;
  label: string;
  enabled: boolean;
  selected: boolean;
  editing: boolean;
  focused: boolean;
};

/**
 * Component (View)
 */
export type LabelItemProps = {
  index?: number;
  total?: number;
  label?: string;
  placeholder?: string;
  maxLength?: number;

  left?: LabelAction | LabelAction[] | null;
  right?: LabelAction | LabelAction[] | null;

  enabled?: boolean;
  selected?: boolean;
  editing?: boolean;
  focused?: boolean;

  focusOnReady?: boolean;
  focusOnEdit?: boolean;
  tabIndex?: number;
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
};

export type LabelItemKeyHandler = (e: LabelItemKeyHandlerArgs) => void;
export type LabelItemKeyHandlerArgs = {
  position: LabelItemPosition;
  label: string;
  editing: boolean;
  code: string;
  is: t.KeyboardKeyFlags;
  keypress: t.KeyboardKeypressProps;
};

export type LabelItemFocusHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemFocusHandlerArgs = {
  position: LabelItemPosition;
  label: string;
  focused: boolean;
};

export type LabelItemClickHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  position: LabelItemPosition;
  label: string;
  focused: boolean;
  editing: boolean;
};
