import type { t } from './common';

/**
 * <Component>
 */
export type InfoHistoryGridProps = {
  page?: t.DocHistoryPage;
  hashLength?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onItemClick?: t.InfoHistoryItemHandler;
};

/**
 * Events.
 */
export type InfoHistoryItemHandler = (e: InfoHistoryItemHandlerArgs) => void;
export type InfoHistoryItemHandlerArgs = {
  hash: t.HashString;
  index: t.Index;
  commit: t.DocHistoryCommit;
  page: t.DocHistoryPage;
};
