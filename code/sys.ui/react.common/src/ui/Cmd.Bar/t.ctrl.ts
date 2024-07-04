import type { t } from './common';

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

/**
 * Command Methods.
 */
export type CmdBarCtrlMethods = CmdBarMethods & { readonly cmd: t.CmdBarCtrl };
export type CmdBarMethods = {
  readonly focus: t.CmdMethodVoid<Focus>;
  readonly blur: t.CmdMethodVoid<Blur>;
  readonly selectAll: t.CmdMethodVoid<SelectAll>;
  readonly caretToStart: t.CmdMethodVoid<CaretToStart>;
  readonly caretToEnd: t.CmdMethodVoid<CaretToEnd>;
  readonly invoke: t.CmdMethodVoid<Invoke>;
};
