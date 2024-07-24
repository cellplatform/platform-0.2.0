import type { t } from './common';

/**
 * <Component>
 */
export type CmdViewProps = {
  doc?: t.Doc;
  repo?: { store?: t.Store; index?: t.StoreIndex };
  readOnly?: boolean;
  historyStack?: boolean;
  border?: number | [number, number, number, number];
  borderColor?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
