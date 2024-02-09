import type { t } from './common';

/**
 * <Component>
 */
export type CommandBarProps = {
  text?: string;
  placeholder?: string;
  hintKey?: string | string[];
  enabled?: boolean;
  focusOnReady?: boolean;
  style?: t.CssValue;
  onReady?: t.TextInputReadyHandler;
  onChange?: t.TextInputChangeEventHandler;
  onFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
};
