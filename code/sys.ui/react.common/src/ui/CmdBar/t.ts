import type { t } from './common';
export type * from './t.ctrl';

/**
 * <Component>
 */
export type CmdBarProps = {
  cmd?: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  text?: string;
  placeholder?: string;
  hintKey?: string | string[];
  prefix?: JSX.Element | null | false;
  suffix?: JSX.Element | null | false;
  enabled?: boolean;
  focusOnReady?: boolean;
  useKeyboard?: boolean;

  theme?: t.CommonTheme;
  style?: t.CssValue;

  onReady?: t.CmdBarReadyHandler;
  onChange?: t.CmdBarChangeHandler;
  onSelect?: t.TextInputSelectHandler;
  onFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
};

/**
 * Events
 */
export type CmdBarReadyHandler = (e: CmdBarReadyHandlerArgs) => void;
export type CmdBarReadyHandlerArgs = {
  readonly cmdbar: t.CmdBarCtrl;
  readonly textbox: t.TextInputRef;
  readonly text: string;
};

export type CmdBarChangeHandler = (e: CmdBarChangeHandlerArgs) => void;
export type CmdBarChangeHandlerArgs = t.TextInputChangeArgs & { readonly parsed: t.ParsedArgs };
