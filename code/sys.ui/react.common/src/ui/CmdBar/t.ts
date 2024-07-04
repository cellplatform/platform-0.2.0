import type { t } from './common';
export type * from './t.ctrl';

/**
 * <Component>
 */
export type CmdBarProps = {
  ctrl?: t.CmdBarCtrl;
  text?: string;
  placeholder?: string;
  hintKey?: string | string[];
  prefix?: JSX.Element | null | false;
  suffix?: JSX.Element | null | false;
  enabled?: boolean;
  focusOnReady?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReady?: t.TextInputReadyHandler;
  onChange?: t.CmdBarChangeHandler;
  onSelect?: t.TextInputSelectHandler;
  onFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
};

/**
 * Events
 */
export type CmdBarChangeHandler = (e: CmdBarChangeHandlerArgs) => void;
export type CmdBarChangeHandlerArgs = t.TextInputChangeArgs & { readonly parsed: t.ParsedArgs };
