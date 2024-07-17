import type { t } from './common';

/**
 * <Component>
 */
export type CmdViewProps = {
  doc?: t.Doc;
  store?: t.Store;
  index?: t.StoreIndex;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
