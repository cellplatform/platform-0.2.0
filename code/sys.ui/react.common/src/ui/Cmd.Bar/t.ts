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
  onChange?: t.CmdBarChangeHandler;
  onSelect?: t.TextInputSelectHandler;
  onFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
};

export type CmdBarChangeHandler = (e: CmdBarChangeHandlerArgs) => void;
export type CmdBarChangeHandlerArgs = t.TextInputChangeArgs & { readonly parsed: t.ParsedArgs };

/**
 * Commands
 */
export type CmdBarCtrl = t.Cmd<CmdBarCtrlCmdType>;
export type CmdBarCtrlCmdType = Focus | Blur | SelectAll | CaretToStart | CaretToEnd | Invoke;
type Focus = t.CmdType<'Focus', { select?: boolean }>;
type Blur = t.CmdType<'Blur', {}>;
type SelectAll = t.CmdType<'SelectAll', {}>;
type CaretToStart = t.CmdType<'CaretToStart', {}>;
type CaretToEnd = t.CmdType<'CaretToEnd', {}>;
type Invoke = t.CmdType<'Invoke', {}>;

export type CmdBarCtrlMethods = CmdBarMethods & { readonly cmd: t.CmdBarCtrl };
export type CmdBarMethods = {
  readonly focus: t.CmdMethodVoid<Focus>;
  readonly blur: t.CmdMethodVoid<Blur>;
  readonly selectAll: t.CmdMethodVoid<SelectAll>;
  readonly caretToStart: t.CmdMethodVoid<CaretToStart>;
  readonly caretToEnd: t.CmdMethodVoid<CaretToEnd>;
  readonly invoke: t.CmdMethodVoid<Invoke>;
};
