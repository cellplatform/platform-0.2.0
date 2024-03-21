import type { t } from './common';

/**
 * <Component>
 */
export type DevReloadProps = {
  isCloseable?: boolean;
  isReloadRequired?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onCloseClick?: () => void;
  onReloadClick?: () => void;
};
