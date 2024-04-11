import type { t } from './common';

/**
 * <Component>
 */
export type CanvasCrdtProps = {
  userId?: string;
  doc?: t.DocRef<t.TLStoreSnapshot>;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
