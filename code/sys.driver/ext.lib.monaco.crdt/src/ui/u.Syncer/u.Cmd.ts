import { Cmd, DEFAULTS, type t } from './common';
import { purge } from './u.Cmd.purge';
import { toCmd, toMethods } from './u.Cmd.to';
import { PathUtil } from './u.Path';

type C = t.SyncCmdType;
type PathsInput = t.EditorPaths | t.ObjectPath;

/**
 * Command for working with the syncer.
 */
export const CmdUtil = {
  purge,
  toMethods,
  toCmd,

  /**
   * Factory.
   */
  create(
    transport: t.CmdTransport,
    issuer: t.IdString,
    options: { paths?: PathsInput; dispose$?: t.UntilObservable } = {},
  ) {
    const { dispose$ } = options;
    const { min, max } = DEFAULTS.autopurge;
    const paths = PathUtil.wrangle(options.paths).cmd;

    type T = t.Cmd<C>;
    const cmd = Cmd.create<C>(transport, { paths, issuer }) as T;
    Cmd.autopurge(cmd as any, { dispose$, min, max });

    return CmdUtil.toMethods(cmd);
  },
} as const;
