import type { t } from './common';

/**
 * <Component>
 */
export type KeyHintProps = {
  text?: string;
  parse?: boolean;
  os?: t.UserAgentOSKind;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export type KeyHintComboProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
