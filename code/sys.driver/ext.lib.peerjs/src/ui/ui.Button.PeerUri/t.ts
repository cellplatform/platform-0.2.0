import type { t } from './common';

/**
 * <Component>
 */
export type PeerUriButtonProps = {
  id?: string;
  prefix?: string;
  fontSize?: number;
  bold?: boolean;
  monospace?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
