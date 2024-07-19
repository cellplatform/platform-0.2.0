import type { t } from './common';

/**
 * <Component>
 */
export type PageStackProps = {
  pages?: string[]; // Unique page identifiers.
  transitionTime?: t.Msecs;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
