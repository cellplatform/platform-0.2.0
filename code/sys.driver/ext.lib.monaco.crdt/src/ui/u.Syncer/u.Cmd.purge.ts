import { ObjectPath, type t } from './common';
import { PathUtil } from './u.Path';
import { PingUtil } from './u.Ping';

/**
 * Query the status of all identities, and purge dead ones.
 */
export async function purge(args: {
  cmd: t.SyncCmdMethods;
  lens: t.Immutable;
  self: t.EditorIdentityString;
  paths: t.EditorPaths;
}) {
  const { cmd, self, paths, lens } = args;
  const identities = ObjectPath.resolve<t.EditorIdentities>(lens.current, paths.identity) ?? {};
  const res = await PingUtil.stillAlive(cmd, Object.keys(identities));

  if (res.total.dead > 0) {
    lens.change((d) => {
      res.dead
        .filter((identity) => identity !== self)
        .forEach((identity) => {
          const path = PathUtil.identity(identity, paths).self;
          ObjectPath.Mutate.delete(d, path);
        });
    });
  }

  return res;
}
