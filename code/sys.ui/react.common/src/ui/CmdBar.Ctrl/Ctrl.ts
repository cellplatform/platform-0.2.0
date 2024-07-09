import { Cmd, DEFAULTS, Immutable, type t } from './common';
import { listen } from './Ctrl.listen';
import { Is, Path } from './u';

type C = t.CmdBarCtrlType;

/**
 * API for controlling the <CmdBar> component via logical commands.
 */
export const Ctrl = {
  Is,
  Path,
  listen,

  create(transport?: t.CmdImmutable, options: { paths?: t.CmdBarPaths } = {}): t.CmdBarCtrl {
    const cmd = create(transport, options.paths);
    return methods(cmd);
  },

  toCtrl(input: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>): t.CmdBarCtrl {
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
    keyboard: method('Keyboard'),
    events(dispose$?: t.UntilObservable) {
      return cmd.events(dispose$);
    },
  };
}
