import { type t } from './common';

export type LabelActionKind = string;
export type LabelAction<K extends LabelActionKind = string> = {
  kind: K;
  enabled?: boolean;
  width?: number;
  icon?: JSX.Element | RenderLabelActionIcon | false;
  spinning?: boolean;
  onClick?: LabelItemActionHandler;
};

export type RenderLabelActionIcon = (args: RenderLabelActionIconArgs) => JSX.Element;
export type RenderLabelActionIconArgs = {
  enabled: boolean;
  selected: boolean;
  color: string;
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
  editing?: boolean;
  selected?: boolean;
  focused?: boolean;
  focusOnReady?: boolean;
  focusOnEdit?: boolean;
  tabIndex?: number;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;
} & LabelItemPropsHandlers;

export type LabelItemPropsHandlers = {
  onReady?: LabelItemReadyHandler;
  onChange?: LabelItemChangeHandler;
  onEnter?: LabelItemEnterKeyHandler;
  onFocusChange?: LabelItemFocusHandler;
  onClick?: LabelItemClickHandler;
  onDoubleClick?: LabelItemClickHandler;
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
