import type { t } from './common';

type O = Record<string, unknown>;

export type CmdBarFocusTarget = 'CmdBar' | 'Main';

/**
 * Paths
 */
export type CmdBarPaths = {
  readonly text: t.ObjectPath;
  readonly cmd: t.ObjectPath;
  readonly history: t.ObjectPath;
};
export type CmdBarPathResolver = (data: O) => {
  readonly text: string;
  readonly cmd: t.CmdPathsObject<t.CmdBarCtrlType>;
  readonly history: string[];
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
  | Keyboard
  | Clear
  | History
  | Update;

type Current = t.CmdType<'Current', O>;
type CurrentR = t.CmdType<'Current:res', { text: string }>;
type CaretToStart = t.CmdType<'Caret:ToStart', O>;
type CaretToEnd = t.CmdType<'Caret:ToEnd', O>;
type Invoke = t.CmdType<'Invoke', { text: string }>;
type Keyboard = t.CmdType<'Keyboard', KeyboardAction>;

type Focus = t.CmdType<'Focus', { target?: CmdBarFocusTarget }>;
type Clear = t.CmdType<'Clear', O>;
type Update = t.CmdType<'Update', { text?: string }>;

type Select = t.CmdType<'Select', SelectP>;
type SelectP = { scope?: 'All' | 'Expand' | 'Toggle:Full' };

type History = t.CmdType<'History', HistoryP>;
type HistoryP = { action: 'ArrowUp' | 'ArrowDown' };

/**
 * Command Methods (ctrl).
 */
export type CmdBarCtrl = {
  readonly current: t.CmdMethodResponder<Current, CurrentR>;
  readonly focus: t.CmdMethodVoid<Focus>;
  readonly select: t.CmdMethodVoid<Select>;
  readonly caretToStart: t.CmdMethodVoid<CaretToStart>;
  readonly caretToEnd: t.CmdMethodVoid<CaretToEnd>;
  readonly invoke: t.CmdMethodVoid<Invoke>;
  readonly keyboard: t.CmdMethodVoid<Keyboard>;
  readonly history: t.CmdMethodVoid<History>;
  readonly update: t.CmdMethodVoid<Update>;
  readonly clear: t.CmdMethodVoid<Clear>;
  events(dispose$?: t.UntilObservable): t.CmdEvents<t.CmdBarCtrlType>;
};

/**
 * Keyboard Actions.
 */
export type KeyboardAction = KeyFocus | KeyFocusMain;
type KeyFocus = { name: 'Focus:CmdBar' };
type KeyFocusMain = { name: 'Focus:Main' };
