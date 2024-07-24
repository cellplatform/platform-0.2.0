import { Cmd, DEFAULTS, Immutable, type t } from './common';
import { listen } from './Ctrl.listen';
import { Is, methods, Path, toCmd, toCtrl, toPaths } from './u';

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
  toPaths,

  create(transport?: t.CmdTransport, options: { paths?: t.CmdBarPaths } = {}): t.CmdBarCtrl {
    const paths = options.paths ?? DEFAULTS.paths;
    const cmd = factory(transport, paths);
    (cmd as any)[DEFAULTS.symbol.paths] = paths;
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
