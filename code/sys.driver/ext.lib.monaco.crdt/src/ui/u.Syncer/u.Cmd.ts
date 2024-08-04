import { Cmd, DEFAULTS, type t } from './common';
import { PathUtil } from './u.Path';
import { purge } from './u.Cmd.purge';

type C = t.SyncCmdType;
type PathsInput = t.EditorPaths | t.ObjectPath;

/**
 * Command for working with the syncer.
 */
export const CmdUtil = {
  purge,

  /**
   * Factory.
   */
  create(transport: t.CmdTransport, options: { paths?: PathsInput } = {}) {
    const paths = PathUtil.wrangle(options.paths).cmd;
    const cmd = Cmd.create<C>(transport, { paths }) as t.Cmd<C>;
    return CmdUtil.toMethods(cmd);
  },

  /**
   * Convert a raw <Cmd> object into strongly typed methods API.
   */
  toMethods(input: t.Cmd<t.SyncCmdType>) {
    const methods: t.SyncCmdMethods = {
      ping: input.method('Ping', 'Ping:R'),
    };
    (methods as any)[DEFAULTS.Symbols.cmd] = input;
    return methods;
  },

  /**
   * Extract the raw <Cmd> object from a methods API object.
   */
  toCmd(ctrl: t.SyncCmdMethods) {
    const methods = ctrl as any;
    return methods[DEFAULTS.Symbols.cmd] as t.Cmd<t.SyncCmdType>;
  },
} as const;
