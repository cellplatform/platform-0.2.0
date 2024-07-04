import { Cmd, Immutable, type t } from './common';
import { Is } from './u.Is';

type C = t.CmdBarCtrlType;

/**
 * Command API for controlling the <CmdBar> component.
 */
export const Ctrl = {
  create(transport?: t.CmdImmutable): t.CmdBarCtrlMethods {
    const cmd = create(transport);
    return { cmd, ...methods(cmd) };
  },

  withMethods(input: t.CmdBarCtrl | t.CmdBarCtrlMethods): t.CmdBarCtrlMethods {
    if (Is.ctrlMethods(input)) return input;
    return { cmd: input, ...methods(input) };
  },
} as const;

/**
 * Helpers
 */
function create(transport?: t.CmdImmutable) {
  const doc = transport ?? Immutable.clonerRef({});
  return Cmd.create<C>(doc) as t.CmdBarCtrl;
}

function methods(ctrl: t.CmdBarCtrl): t.CmdBarMethods {
  const method = ctrl.method;
  return {
    focus: method('Focus'),
    blur: method('Blur'),
    selectAll: method('SelectAll'),
    caretToStart: method('CaretToStart'),
    caretToEnd: method('CaretToEnd'),
    invoke: method('Invoke'),
  };
}
