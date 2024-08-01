import { Cmd, type t } from './common';
import { SyncerPath } from './u.Path';

type C = t.SyncCmdType;

/**
 * Command for working with the syncer.
 */
export const SyncerCmd = {
  /**
   * Factory.
   */
  create(transport: t.CmdTransport, options: { paths?: t.EditorPaths | t.ObjectPath } = {}) {
    const paths = SyncerPath.wrangle(options.paths).cmd;
    const cmd = Cmd.create<C>(transport, { paths });
    return cmd as t.Cmd<C>;
  },
} as const;
