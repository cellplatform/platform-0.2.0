import type { t } from './common';

/**
 * Commands for controlling the <CmdBar> UI component.
 */
export type CmdBarCtrlType =
  | Focus
  | Blur
  | SelectAll
  | CaretToStart
  | CaretToEnd
  | Invoke
  | KeyAction;

type Focus = t.CmdType<'Focus', { select?: boolean }>;
type Blur = t.CmdType<'Blur', {}>;
type SelectAll = t.CmdType<'Select:All', {}>;
type CaretToStart = t.CmdType<'Caret:ToStart', {}>;
type CaretToEnd = t.CmdType<'Caret:ToEnd', {}>;
type Invoke = t.CmdType<'Invoke', { text: string }>;

type KeyAction = t.CmdType<'Key:Action', KeyActionParams>;
type KeyActionParams = KeyFocusAndSelect;
type KeyFocusAndSelect = { name: 'FocusAndSelect' };

/**
 * Command Methods.
 */
export type CmdBarCtrl = {
  readonly cmd: t.Cmd<t.CmdBarCtrlType>;
  readonly focus: t.CmdMethodVoid<Focus>;
  readonly blur: t.CmdMethodVoid<Blur>;
  readonly selectAll: t.CmdMethodVoid<SelectAll>;
  readonly caretToStart: t.CmdMethodVoid<CaretToStart>;
  readonly caretToEnd: t.CmdMethodVoid<CaretToEnd>;
  readonly invoke: t.CmdMethodVoid<Invoke>;
  readonly keyAction: t.CmdMethodVoid<KeyAction>;
};
