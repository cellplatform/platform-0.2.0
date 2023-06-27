import { type t } from './common';

/**
 * Properties
 */
export type ChainSelectorProps = {
  title?: string;
  selected?: t.ChainName[];
  resettable?: boolean;
  showIndexes?: boolean;
  indent?: number;
  style?: t.CssValue;
  onChange?: t.ChainSelectionChangeHandler;
};

/**
 * Events
 */
export type ChainSelectionChangeHandler = (e: ChainSelectionChangeHandlerArgs) => void;
export type ChainSelectionChangeHandlerArgs = {
  empty: boolean;
  prev: t.ChainName[];
  next: t.ChainName[];
};
