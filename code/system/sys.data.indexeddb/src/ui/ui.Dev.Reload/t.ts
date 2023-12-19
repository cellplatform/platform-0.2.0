import type { t } from './common';

/**
 * <Component>
 */
export type DevReloadProps = {
  isCloseable?: boolean;
  style?: t.CssValue;
  onClose?: () => void;
};
