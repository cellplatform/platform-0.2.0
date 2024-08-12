import { ObjectPath, type t } from './common';
import { IdentityUtil } from './u.Identity';
import { PathUtil } from './u.Path';
import { PingUtil } from './u.Ping';

/**
 * Query the status of all identities, and purge dead ones.
 */
export async function purge(
  cmd: t.SyncCmdMethods,
  args: {
    lens: t.Immutable;
    self: t.EditorIdentityString;
    paths: t.EditorPaths;
    timeout?: t.Msecs | t.Msecs[];
  },
): Promise<t.SyncPurgeResponse> {
  const { self, paths, lens, timeout } = args;
  const identities = IdentityUtil.resolveIdentities(lens, paths);
  const res = await PingUtil.alive(cmd, Object.keys(identities), { timeout });

  if (res.total.dead > 0) {
    const dead = res.dead.filter((identity) => identity !== self);
    lens.change((d) => {
      dead.forEach((identity) => {
        const path = PathUtil.identity(identity, paths).self;
        ObjectPath.Mutate.delete(d, path);
      });
    });
  }

  return res;
}
