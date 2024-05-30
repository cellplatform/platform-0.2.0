import { listenerFactory } from './Cmd.Listener';
import { DEFAULTS, ObjectPath, Time, type t } from './common';
import { Events, Is, Path } from './u';

type O = Record<string, unknown>;
type TxFactory = () => string;
type OptionsInput = Options | t.CmdPaths;
type Options = {
  paths?: t.CmdPaths;
  tx?: TxFactory;
};

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

  const update = (tx: string, name: string, params: O, increment = false) => {
    doc.change((d) => {
      const counter = resolve.counter(d) as t.A.Counter;
      mutate(d, paths.tx, tx);
      mutate(d, paths.name, name);
      mutate(d, paths.params, params);
      if (increment) counter.increment(1);
    });
  };

  // Ensure document is initialized with the {cmd} structure.
  if (!Is.initialized(doc.current)) update('', '', {}); // ← (default empty structure).

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(name, params, options = {}) {
      const tx = wrangle.invoke.tx(options, args.tx);
      const res: t.CmdResponse<C> = {
        tx,
        req: { name, params },
        listen(name, { dispose$ } = {}) {
          return listenerFactory<C>(api, { tx, name, dispose$ });
        },
      };

      // NB: delay document update for a tick to enable response
      //     listener to be setup at call-site.
      Time.delay(0, () => update(tx, name, params, true));
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

  invoke: {
    options(input?: t.CmdInvokeOptions | string): t.CmdInvokeOptions {
      if (!input) return {};
      if (typeof input === 'string') return { tx: input };
      return input;
    },

    tx(options?: t.CmdInvokeOptions | string, factory?: TxFactory) {
      return wrangle.invoke.options(options).tx || (factory ?? DEFAULTS.tx)();
    },
  },
} as const;
