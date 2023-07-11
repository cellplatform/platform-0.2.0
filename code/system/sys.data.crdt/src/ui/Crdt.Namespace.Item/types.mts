import { type t } from './common';

/**
 * Component
 */
export type CrdtNamespaceItemProps = {
  namespace?: string;
  enabled?: boolean;
  selected?: boolean;
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
  namespace: string;
};
