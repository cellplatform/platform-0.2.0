import type { t } from './common';

/**
 * <Component>
 */
export type HistoryGridProps = {
  page?: t.DocHistoryPage;
  hashLength?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
