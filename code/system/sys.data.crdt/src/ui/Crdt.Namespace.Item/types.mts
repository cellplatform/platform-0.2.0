import { type t } from './common';

/**
 * Component
 */
export type CrdtNamespaceItemProps = {
  text?: string;
  enabled?: boolean;
  selected?: boolean;
  editing?: boolean;
  maxLength?: number;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;

  onChange?: t.CrdtNamespaceItemChangeHandler;
};

/**
 * Events
 */
export type CrdtNamespaceItemChangeHandler = (e: CrdtNamespaceItemChangeHandlerArgs) => void;
export type CrdtNamespaceItemChangeHandlerArgs = {
  text: string;
};
