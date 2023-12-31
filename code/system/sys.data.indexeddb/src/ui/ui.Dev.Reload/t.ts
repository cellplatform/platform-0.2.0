import type { t } from './common';

/**
 * <Component>
 */
export type DevReloadProps = {
  isCloseable?: boolean;
  isReloadRequired?: boolean;
  style?: t.CssValue;
  onCloseClick?: () => void;
  onReloadClick?: () => void;
};
