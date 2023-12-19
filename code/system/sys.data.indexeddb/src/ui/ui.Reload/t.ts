import type { t } from './common';

/**
 * <Component>
 */
export type ReloadProps = {
  isCloseable?: boolean;
  style?: t.CssValue;
  onClose?: () => void;
};
