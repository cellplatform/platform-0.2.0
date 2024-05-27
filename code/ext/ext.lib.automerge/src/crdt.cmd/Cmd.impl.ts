import { ObjectPath, type t } from './common';
import { Events, Path } from './u';

/**
 * Command factory.
 */
export function create<C extends t.CmdTx>(
  doc: t.DocRef | t.Lens,
  options: { paths?: t.CmdPaths } = {},
): t.Cmd<C> {
  const mutate = ObjectPath.mutate;
  const resolve = Path.resolver(options.paths);
  const paths = resolve.paths;

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(cmd, params) {
      doc.change((d) => {
        mutate(d, paths.name, cmd);
        mutate(d, paths.params, params);
        (resolve.count(d) as t.A.Counter).increment(1);
      });
    },

    events(dispose$?: t.UntilObservable) {
      return Events.create<C>(doc, { paths, dispose$ });
    },
  } as const;
  return api;
}
