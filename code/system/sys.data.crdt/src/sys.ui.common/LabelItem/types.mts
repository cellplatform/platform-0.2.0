import { type t } from './common';

export type LabelItemActionKind = 'Repo' | 'Editing' | 'Json' | 'ObjectTree';

/**
 * Component (View)
 */
export type LabelItemProps = {
  label?: string;
  placeholder?: string;
  maxLength?: number;

  enabled?: boolean;
  selected?: boolean;
  editing?: boolean;
  focusOnReady?: boolean;
  focusOnEdit?: boolean;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;
} & LabelItemPropsHandlers;

export type LabelItemPropsHandlers = {
  onReady?: LabelItemReadyHandler;
  onChange?: LabelItemChangeHandler;
  onActionClick?: LabelItemClickHandler;
  onEnter?: LabelItemEnterKeyHandler;
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

export type LabelItemClickHandler = (e: LabelItemClickHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  actions: t.LabelItemActionKind[];
};

export type LabelItemEnterKeyHandler = (e: LabelItemEnterKeyHandlerArgs) => void;
export type LabelItemEnterKeyHandlerArgs = {
  label: string;
};
