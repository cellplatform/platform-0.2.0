import type { t } from './common';

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
  onChange?: t.TextInputChangeHandler;
  onSelect?: t.TextInputSelectHandler;
  onFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
};

/**
 * Commands
 */
export type CmdBarCtrl = t.Cmd<CmdBarCtrlCmdType>;
export type CmdBarCtrlCmdType = Focus | Blur | SelectAll | CaretToStart | CaretToEnd;
type Focus = t.CmdType<'Focus', { select?: boolean }>;
type Blur = t.CmdType<'Blur', {}>;
type SelectAll = t.CmdType<'SelectAll', {}>;
type CaretToStart = t.CmdType<'CaretToStart', {}>;
type CaretToEnd = t.CmdType<'CaretToEnd', {}>;
