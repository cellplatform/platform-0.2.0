import type { t } from './common';

/**
 * Commands for controlling the <CmdBar> UI component.
 */
export type CmdBarCtrl = t.Cmd<CmdBarCtrlType>;
export type CmdBarCtrlType = Focus | Blur | SelectAll | CaretToStart | CaretToEnd | Invoke;

type Focus = t.CmdType<'Focus', { select?: boolean }>;
type Blur = t.CmdType<'Blur', {}>;
type SelectAll = t.CmdType<'SelectAll', {}>;
type CaretToStart = t.CmdType<'CaretToStart', {}>;
type CaretToEnd = t.CmdType<'CaretToEnd', {}>;
type Invoke = t.CmdType<'Invoke', { text: string }>;

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
