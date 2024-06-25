import { Cmd, Immutable, type t } from './common';

/**
 * Command API for the component.
 */
export function control(transport?: t.CmdImmutable) {
  type C = t.CmdBarControlCmdType;
  const doc = transport ?? Immutable.clonerRef({});
  const cmd = Cmd.create<C>(doc) as t.CmdBarControl;

  return {
    cmd,
    focus: cmd.method('Focus'),
    blur: cmd.method('Blur'),
    selectAll: cmd.method('SelectAll'),
    caretToStart: cmd.method('CaretToStart'),
    caretToEnd: cmd.method('CaretToEnd'),
  } as const;
}
