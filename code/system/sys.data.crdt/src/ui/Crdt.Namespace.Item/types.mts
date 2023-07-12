import { type t } from './common';

export type CrdtNsItemActionKind = 'Repo' | 'Editing' | 'Json' | 'ObjectTree';

/**
 * Component
 */
export type CrdtNamespaceItemProps = {
  text?: string;
  maxLength?: number;

  enabled?: boolean;
  selected?: boolean;
  editing?: boolean;
  focusOnReady?: boolean;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;

  onReady?: CrdtNamespaceItemReadyHandler;
  onChange?: CrdtNamespaceItemChangeHandler;
  onClick?: CrdtNamespaceItemClickHandler;
  onEnter?: CrdtNamespaceItemEnterKeyHandler;
};

/**
 * ref={ ƒ }
 */
export type CrdtNamespaceItemRef = {
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
export type CrdtNamespaceItemReadyHandler = (e: CrdtNamespaceItemReadyHandlerArgs) => void;
export type CrdtNamespaceItemReadyHandlerArgs = {
  ref: CrdtNamespaceItemRef;
};

export type CrdtNamespaceItemChangeHandler = (e: CrdtNamespaceItemChangeHandlerArgs) => void;
export type CrdtNamespaceItemChangeHandlerArgs = {
  text: string;
};

export type CrdtNamespaceItemClickHandler = (e: CrdtNamespaceItemClickHandlerArgs) => void;
export type CrdtNamespaceItemClickHandlerArgs = {
  actions: t.CrdtNsItemActionKind[];
};

export type CrdtNamespaceItemEnterKeyHandler = (e: CrdtNamespaceItemEnterKeyHandlerArgs) => void;
export type CrdtNamespaceItemEnterKeyHandlerArgs = {
  text: string;
};
