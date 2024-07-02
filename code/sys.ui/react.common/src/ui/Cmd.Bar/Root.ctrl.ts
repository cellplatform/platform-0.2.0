import { Cmd, Immutable, type t } from './common';

/**
 * Command API for controlling the <CmdBar> component.
 */
export const Ctrl = {
  create(transport?: t.CmdImmutable): t.CmdBarCtrlMethods {
    type C = t.CmdBarCtrlCmdType;
    const doc = transport ?? Immutable.clonerRef({});
    const cmd = Cmd.create<C>(doc) as t.CmdBarCtrl;
    return { cmd, ...Ctrl.methods(cmd) };
  },

  methods(cmd: t.CmdBarCtrl): t.CmdBarMethods {
    return {
      focus: cmd.method('Focus'),
      blur: cmd.method('Blur'),
      selectAll: cmd.method('SelectAll'),
      caretToStart: cmd.method('CaretToStart'),
      caretToEnd: cmd.method('CaretToEnd'),
      invoke: cmd.method('Invoke'),
    };
  },
} as const;
