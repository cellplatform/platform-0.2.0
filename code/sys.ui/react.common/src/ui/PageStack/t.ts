import type { t } from './common';

/**
 * <Component>
 */
export type PageStackProps = {
  current?: number;
  total?: number;
  transition?: t.Msecs;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
