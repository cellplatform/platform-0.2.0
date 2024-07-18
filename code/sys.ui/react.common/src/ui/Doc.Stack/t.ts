import type { t } from './common';

/**
 * <Component>
 */
export type DocStackProps = {
  pages?: string[]; // inique-identifiers
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
