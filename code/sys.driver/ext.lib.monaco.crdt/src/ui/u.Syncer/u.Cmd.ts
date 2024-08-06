import { Cmd, type t } from './common';
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
  create(transport: t.CmdTransport, options: { paths?: PathsInput } = {}) {
    const paths = PathUtil.wrangle(options.paths).cmd;
    const cmd = Cmd.create<C>(transport, { paths }) as t.Cmd<C>;
    return CmdUtil.toMethods(cmd);
  },
} as const;
