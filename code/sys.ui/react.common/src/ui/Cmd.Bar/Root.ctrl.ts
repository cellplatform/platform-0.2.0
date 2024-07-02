import { Cmd, Immutable, type t } from './common';
import { Is } from './u.Is';

type C = t.CmdBarCtrlCmdType;

/**
 * Command API for controlling the <CmdBar> component.
 */
export const Ctrl = {
  create(transport?: t.CmdImmutable): t.CmdBarCtrlMethods {
    const cmd = Ctrl.cmd(transport);
    return { cmd, ...Ctrl.methods(cmd) };
  },

  methods(input: t.CmdBarCtrl | t.CmdBarMethods): t.CmdBarMethods {
    if (Is.methods(input)) return input;
    const method = input.method;
    return {
      focus: method('Focus'),
      blur: method('Blur'),
      selectAll: method('SelectAll'),
      caretToStart: method('CaretToStart'),
      caretToEnd: method('CaretToEnd'),
      invoke: method('Invoke'),
    };
  },

  cmd(transport?: t.CmdImmutable) {
    const doc = transport ?? Immutable.clonerRef({});
    return Cmd.create<C>(doc) as t.CmdBarCtrl;
  },
} as const;
