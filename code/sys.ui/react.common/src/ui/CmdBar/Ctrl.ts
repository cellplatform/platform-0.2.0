import { Cmd, DEFAULTS, Immutable, type t } from './common';
import { listen } from './Ctrl.listen';
import { Is } from './u.Is';

type C = t.CmdBarCtrlType;

/**
 * Command API for controlling the <CmdBar> component.
 */
export const Ctrl = {
  listen,

  create(transport?: t.CmdImmutable, options: { paths?: t.CmdBarPaths } = {}): t.CmdBarCtrl {
    const cmd = create(transport, options.paths);
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
function create(transport?: t.CmdImmutable, cmdpaths: t.CmdBarPaths = DEFAULTS.paths) {
  const paths = Cmd.Path.prepend(cmdpaths.cmd);
  const doc = transport ?? Immutable.clonerRef({});
  return Cmd.create<C>(doc, { paths }) as t.Cmd<t.CmdBarCtrlType>;
}

function methods(cmd: t.Cmd<t.CmdBarCtrlType>): t.CmdBarCtrl {
  const method = cmd.method;
  return {
    _: cmd,
    current: method('Current', 'Current:res'),
    focus: method('Focus'),
    select: method('Select'),
    caretToStart: method('Caret:ToStart'),
    caretToEnd: method('Caret:ToEnd'),
    invoke: method('Invoke'),
    keyAction: method('Key:Action'),
    events(dispose$?: t.UntilObservable) {
      return cmd.events(dispose$);
    },
  };
}
