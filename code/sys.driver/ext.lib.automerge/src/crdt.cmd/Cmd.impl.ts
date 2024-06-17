import { DEFAULTS, ObjectPath, Time, type t, type u } from './common';
import { Events, Is, Path } from './u';
import { Listener } from './u.Listener';

type O = Record<string, unknown>;
type Tx = string;
type TxFactory = () => Tx;
type OptionsInput = Options | t.CmdPaths;
type Options = { paths?: t.CmdPaths; tx?: TxFactory };

/**
 * Command factory.
 */
export function create<C extends t.CmdType>(
  doc: t.DocRef | t.Lens,
  // doc: t.ImmutableRef<any>,
  options?: OptionsInput,
): t.Cmd<C> {
  const mutate = ObjectPath.mutate;
  const args = wrangle.options(options);
  const resolve = Path.resolver(args.paths);
  const paths = resolve.paths;

  const update = (tx: string, name: string, params: O, error?: t.Error, increment = false) => {
    doc.change((d) => {
      const counter = resolve.counter(d) as t.A.Counter;
      mutate(d, paths.tx, tx);
      mutate(d, paths.name, name);
      mutate(d, paths.params, params);
      mutate(d, paths.error, error);
      if (increment) counter.increment(1);
    });
  };

  // Ensure document is initialized with the {cmd} structure.
  if (!Is.initialized(doc.current)) update('', '', {}); // ← (default empty structure).

  /**
   * Invoke method (overloads)
   */
  const invokeSetup = (tx: Tx, name: C['name'], params: C['params'], error?: t.Error) => {
    const res: t.CmdInvoked<any> = { tx, req: { name, params } };
    const start = () => Time.delay(0, () => update(tx, name, params, error, true));
    return { res, start } as const;
  };

  const invoke: t.CmdInvoke<C> = (name, params, opt) => {
    const tx = wrangle.invoke.tx(opt, args.tx);
    const error = wrangle.invoke.error(opt);
    const { res, start } = invokeSetup(tx, name, params, error);
    start();
    return res;
  };

  const invokeWithResponse: t.CmdInvokeResponse<any> = (name, params, opt) => {
    const options = wrangle.invoke.responseOptions(opt);
    const tx = wrangle.invoke.tx(options, args.tx);
    const error = wrangle.invoke.error(options);
    const { timeout, dispose$, onComplete, onError } = options;
    const { start } = invokeSetup(tx, name[0], params, error);
    const res = Listener.create<C>(api, {
      tx,
      req: { name: name[0], params },
      res: { name: name[1] },
      timeout,
      dispose$,
      onComplete,
      onError,
    });
    start();
    return res;
  };

  /**
   * API
   */
  const api: t.Cmd<C> = {
    invoke(...args: any[]) {
      const [p1, p2, p3] = args;
      if (Array.isArray(p1)) return invokeWithResponse(p1 as any, p2 as any, p3);
      if (typeof p2 === 'object') return invoke(p1, p2, p3) as any;
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

  invoke: {
    tx<C extends t.CmdType>(input?: t.CmdInvokeOptions<C> | Tx, txFactory?: TxFactory) {
      const defaultTx = () => (txFactory ?? DEFAULTS.tx)();
      if (!input) return defaultTx();
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input.tx) return input.tx;
      return defaultTx();
    },

    error<C extends t.CmdType>(input?: t.CmdInvokeOptions<C> | Tx): u.ExtractError<C> | undefined {
      return typeof input === 'object' ? input.error : undefined;
    },

    responseOptions<C extends t.CmdType>(
      input?: Tx | t.CmdResponseHandler<C> | t.CmdInvokeResponseOptions<C>,
    ): t.CmdInvokeResponseOptions<C> {
      if (!input) return {};
      if (typeof input === 'string') return {};
      if (typeof input === 'function') return { onComplete: input };
      return input;
    },
  },
} as const;
