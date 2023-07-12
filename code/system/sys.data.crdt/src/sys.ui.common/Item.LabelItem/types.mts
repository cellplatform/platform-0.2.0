import { type t } from './common';

export type LabelItemActionKind = 'Repo' | 'Editing' | 'Json' | 'ObjectTree';

/**
 * Component
 */
export type LabelItemProps = {
  text?: string;
  maxLength?: number;

  enabled?: boolean;
  selected?: boolean;
  editing?: boolean;
  focusOnReady?: boolean;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;

  onReady?: LabelItemReadyHandler;
  onChange?: LabelItemChangeHandler;
  onClick?: LabelItemClickHandler;
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
  text: string;
};

export type LabelItemClickHandler = (e: LabelItemClickHandlerArgs) => void;
export type LabelItemClickHandlerArgs = {
  actions: t.LabelItemActionKind[];
};

export type LabelItemEnterKeyHandler = (e: LabelItemEnterKeyHandlerArgs) => void;
export type LabelItemEnterKeyHandlerArgs = {
  text: string;
};
