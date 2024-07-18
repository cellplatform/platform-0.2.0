import type { t } from './common';

/**
 * <Component>
 */
export type PageStackProps = {
  pages?: string[]; // inique-identifiers
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
