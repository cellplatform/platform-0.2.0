import { Cmd, DEFAULTS, Immutable, Is, type t } from './common';
import { listen } from './Ctrl.listen';

type C = t.CmdBarCtrlType;

/**
 * API for controlling the <CmdBar> component via logical commands.
 */
export const Ctrl = {
  listen,

  create(transport?: t.CmdImmutable, options: { paths?: t.CmdBarPaths } = {}): t.CmdBarRef {
    const cmd = create(transport, options.paths);
    return methods(cmd);
  },

  cmdbar(input: t.CmdBarRef | t.Cmd<t.CmdBarCtrlType>): t.CmdBarRef {
    if (Is.cmdbar(input)) return input;
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

function methods(cmd: t.Cmd<t.CmdBarCtrlType>): t.CmdBarRef {
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
