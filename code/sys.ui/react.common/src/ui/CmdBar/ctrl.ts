import { Cmd, Immutable, type t } from './common';
import { listen } from './ctrl.listen';
import { Is } from './u.Is';

type C = t.CmdBarCtrlType;

/**
 * Command API for controlling the <CmdBar> component.
 */
export const Ctrl = {
  listen,

  create(transport?: t.CmdImmutable): t.CmdBarCtrl {
    const cmd = create(transport);
    return methods(cmd);
  },

  cmdbar(input: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>): t.CmdBarCtrl {
    if (Is.ctrl(input)) return input;
    return methods(input);
  },
} as const;

/**
 * Helpers
 */
function create(transport?: t.CmdImmutable) {
  const doc = transport ?? Immutable.clonerRef({});
  return Cmd.create<C>(doc) as t.Cmd<t.CmdBarCtrlType>;
}

function methods(cmd: t.Cmd<t.CmdBarCtrlType>): t.CmdBarCtrl {
  const method = cmd.method;
  return {
    cmd,
    current: method('Current', 'Current:res'),
    focus: method('Focus'),
    blur: method('Blur'),
    selectAll: method('Select:All'),
    caretToStart: method('Caret:ToStart'),
    caretToEnd: method('Caret:ToEnd'),
    invoke: method('Invoke'),
    keyAction: method('Key:Action'),
  };
}
