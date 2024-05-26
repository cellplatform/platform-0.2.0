import { ObjectPath, slug, type t } from './common';
import { Events, Path } from './u';

/**
 * Command factory.
 */
export function create<C extends t.CmdTx>(
  doc: t.DocRef | t.Lens,
  options: { paths?: t.CmdPaths; tx?: () => string } = {},
): t.Cmd<C> {
  const mutate = ObjectPath.mutate;
  const resolve = Path.resolver(options.paths);
  const paths = resolve.paths;

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(cmd, params) {
      const tx = options.tx?.() || slug();
      doc.change((d) => {
        mutate(d, paths.tx, tx);
        mutate(d, paths.name, cmd);
        mutate(d, paths.params, params);
      });
    },

    events(dispose$?: t.UntilObservable) {
      return Events.create<C>(doc, { paths, dispose$ });
    },
  } as const;
  return api;
}
