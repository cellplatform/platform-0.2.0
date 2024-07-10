import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Paths
 */
export type CmdBarPaths = {
  text: t.ObjectPath;
  cmd: t.ObjectPath;
};
export type CmdBarPathResolver = (data: O) => {
  readonly text: string;
  readonly cmd: t.CmdPathsObject<t.CmdBarCtrlType>;
};

/**
 * Commands for controlling the <CmdBar> UI component.
 */
export type CmdBarCtrlType =
  | Current
  | CurrentR
  | Focus
  | Select
  | CaretToStart
  | CaretToEnd
  | Invoke
  | Keyboard;

type Current = t.CmdType<'Current', O>;
type CurrentR = t.CmdType<'Current:res', { text: string }>;
type Focus = t.CmdType<'Focus', { target?: 'CmdBar' | 'Main' }>;
type CaretToStart = t.CmdType<'Caret:ToStart', O>;
type CaretToEnd = t.CmdType<'Caret:ToEnd', O>;
type Invoke = t.CmdType<'Invoke', { text: string }>;
type Keyboard = t.CmdType<'Keyboard', KeyboardAction>;

type Select = t.CmdType<'Select', SelectParam>;
type SelectParam = { scope?: 'All' | 'Expand' };

/**
 * Command Methods (ctrl).
 */
export type CmdBarCtrl = {
  readonly _: t.Cmd<t.CmdBarCtrlType>;
  readonly current: t.CmdMethodResponder<Current, CurrentR>;
  readonly focus: t.CmdMethodVoid<Focus>;
  readonly select: t.CmdMethodVoid<Select>;
  readonly caretToStart: t.CmdMethodVoid<CaretToStart>;
  readonly caretToEnd: t.CmdMethodVoid<CaretToEnd>;
  readonly invoke: t.CmdMethodVoid<Invoke>;
  readonly keyboard: t.CmdMethodVoid<Keyboard>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};

/**
 * Keyboard Actions.
 */
export type KeyboardAction = KeyFocus | KeyFocusMain;
type KeyFocus = { name: 'Focus:CmdBar' };
type KeyFocusMain = { name: 'Focus:Main' };
