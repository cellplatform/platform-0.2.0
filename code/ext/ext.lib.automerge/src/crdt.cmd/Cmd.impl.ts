import { DEFAULTS, ObjectPath, type t } from './common';
import { Events, Is, Path } from './u';

type Options = { paths?: t.CmdPaths; tx?: () => string };
type OptionsInput = Options | t.CmdPaths;

/**
 * Command factory.
 */
export function create<C extends t.CmdType>(
  doc: t.DocRef | t.Lens,
  options?: OptionsInput,
): t.Cmd<C> {
  const mutate = ObjectPath.mutate;
  const args = wrangle.options(options);
  const resolve = Path.resolver(args.paths);
  const paths = resolve.paths;
  const txFactory = () => (args?.tx ? args.tx() : DEFAULTS.tx());

  // Ensure document is initialized with the {cmd} structure.
  if (!Is.initialized(doc.current)) {
    doc.change((d) => {
      resolve.counter(d) as t.A.Counter;
      mutate(d, paths.tx, '');
      mutate(d, paths.name, '');
      mutate(d, paths.params, {});
    });
  }

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(name, params, options = {}) {
      const tx = options.tx || txFactory();
      doc.change((d) => {
        (resolve.counter(d) as t.A.Counter).increment(1);
        mutate(d, paths.tx, tx);
        mutate(d, paths.name, name);
        mutate(d, paths.params, params);
      });
      const res: t.CmdResponse<C> = { tx, cmd: { name, params } };
      return res;
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
