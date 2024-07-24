import { Cmd, DEFAULTS, Immutable, type t } from './common';
import { listen } from './Ctrl.listen';
import { Is, methods, Path, toCmd, toCtrl } from './u';

type C = t.CmdBarCtrlType;

/**
 * API for controlling the <CmdBar> component via logical commands.
 */
export const Ctrl = {
  Is,
  Path,
  listen,
  toCtrl,
  toCmd,

  create(transport?: t.CmdTransport, options: { paths?: t.CmdBarPaths } = {}): t.CmdBarCtrl {
    const cmd = factory(transport, options.paths);
    return methods(cmd);
  },
} as const;

/**
 * Helpers
 */
function factory(transport?: t.CmdTransport, cmdpaths: t.CmdBarPaths = DEFAULTS.paths) {
  const paths = Cmd.Path.prepend(cmdpaths.cmd);
  const doc = transport ?? Immutable.clonerRef({});
  const cmd = Cmd.create<C>(doc, { paths });
  return cmd as t.Cmd<t.CmdBarCtrlType>;
}
