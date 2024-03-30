import type { t } from './common';

/**
 * <Component>
 */
export type CmdBarProps = {
  text?: string;
  placeholder?: string;
  hintKey?: string | string[];
  enabled?: boolean;
  focusOnReady?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReady?: t.TextInputReadyHandler;
  onChange?: t.TextInputChangeHandler;
  onFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
};
