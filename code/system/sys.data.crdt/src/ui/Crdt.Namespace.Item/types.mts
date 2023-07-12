import { type t } from './common';

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

  onChange?: CrdtNamespaceItemChangeHandler;
  onReady?: CrdtNamespaceItemReadyHandler;
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
export type CrdtNamespaceItemReadyHandlerArgs = { ref: CrdtNamespaceItemRef };

export type CrdtNamespaceItemChangeHandler = (e: CrdtNamespaceItemChangeHandlerArgs) => void;
export type CrdtNamespaceItemChangeHandlerArgs = { text: string };
