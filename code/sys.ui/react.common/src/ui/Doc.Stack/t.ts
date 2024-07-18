import type { t } from './common';

/**
 * <Component>
 */
export type DocStackProps = {
  pages?: string[]; // inique-identifiers
  total?: number;
  height?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
