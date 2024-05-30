import { DEFAULTS, ObjectPath, Time, type t } from './common';
import { Events, Is, Path } from './u';
import { Listener } from './u.Listener';

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
   * Invoke method (overloads)
   */
  const invokeSetup = (name: C['name'], params: C['params'], options?: t.CmdInvokeOptionsInput) => {
    const tx = wrangle.invoke.tx(options, args.tx);
    const obj = { tx, name, params };
    const start = () => Time.delay(0, () => update(tx, name, params, true));
    return { tx, obj, start } as const;
  };

  const invoke: t.CmdInvoker<C> = (name, params, options = {}) => {
    const { obj, start } = invokeSetup(name, params, options);
    start();
    return obj;
  };

  const invokeWithResponse: t.CmdResponseInvoker<C> = (name, responder, params, options) => {
    const { tx, obj, start } = invokeSetup(name, params, options);
    const listen: t.CmdListen<C> = (options) => {
      const { timeout, dispose$, onComplete } = wrangle.listen.options(options);
      const cmd = { req: name, res: responder };
      return Listener.create<C>(api, { tx, cmd, timeout, dispose$, onComplete });
    };
    start();
    return { ...obj, listen };
  };

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(...args: any[]) {
      const [p1, p2, p3, p4] = args;
      if (typeof p2 === 'object') return invoke(p1, p2, p3) as any;
      if (typeof p2 === 'string') return invokeWithResponse(p1, p2 as any, p3, p4);
      throw new Error('overlaoded invoke arguments could not be wrangled');
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

  listen: {
    options<C extends t.CmdType>(
      input?: t.CmdListenOptions<C> | t.CmdListenHandler<C>,
    ): t.CmdListenOptions<C> {
      if (!input) return {};
      if (typeof input === 'function') return { onComplete: input };
      return input;
    },
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
