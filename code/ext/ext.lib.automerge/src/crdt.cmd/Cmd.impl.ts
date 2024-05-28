import { ObjectPath, type t } from './common';
import { Events, Path } from './u';

type Options = { paths?: t.CmdPaths };
type OptionsInput = Options | t.CmdPaths;

/**
 * Command factory.
 */
export function create<C extends t.CmdType>(
  doc: t.DocRef | t.Lens,
  options?: OptionsInput,
): t.Cmd<C> {
  const args = wrangle.options(options);
  const mutate = ObjectPath.mutate;
  const resolve = Path.resolver(args.paths);
  const paths = resolve.paths;

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(cmd, params) {
      doc.change((d) => {
        mutate(d, paths.name, cmd);
        mutate(d, paths.params, params);
        (resolve.counter(d) as t.A.Counter).increment(1);
      });
    },

    events(dispose$?: t.UntilObservable) {
      return Events.create<C>(doc, { paths, dispose$ });
    },
  } as const;
  return api;
}

/**
 * Helpers
 */
const wrangle = {
  options(input?: OptionsInput): Options {
    if (!input) return {};
    if (Path.is.commandPaths(input)) return { paths: input };
    return input;
  },
} as const;
