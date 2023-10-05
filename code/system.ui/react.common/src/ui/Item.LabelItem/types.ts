import { type t } from './common';

/**
 * An "action" represented as a clickable icon button.
 */
export type LabelActionKind = string;
export type LabelAction<K extends LabelActionKind = string> = {
  kind: K;
  width?: number;
  icon?: LabelActionRender | JSX.Element | false;
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
  label?: string;
  placeholder?: string;
  maxLength?: number;

  left?: LabelAction | LabelAction[];
  right?: LabelAction | LabelAction[];

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
  onEnter?: LabelItemEnterKeyHandler;
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
  ref: LabelItemRef;
};

export type LabelItemChangeHandler = (e: LabelItemChangeHandlerArgs) => void;
export type LabelItemChangeHandlerArgs = {
  label: string;
};

export type LabelItemActionHandler = (e: LabelItemActionHandlerArgs) => void;
export type LabelItemActionHandlerArgs = {
  kind: LabelActionKind;
};

export type LabelItemEnterKeyHandler = (e: LabelItemEnterKeyHandlerArgs) => void;
export type LabelItemEnterKeyHandlerArgs = {
  editing: boolean;
  label: string;
};

export type LabelItemFocusHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemFocusHandlerArgs = {
  label: string;
  focused: boolean;
};

export type LabelItemClickHandler = (e: LabelItemFocusHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  label: string;
  focused: boolean;
  editing: boolean;
};
