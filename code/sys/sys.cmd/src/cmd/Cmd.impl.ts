import { DEFAULTS, ObjectPath, Time, type t, type u } from './common';
import { Events, Is, Path } from './u';
import { Listener } from './u.Listener';

type O = Record<string, unknown>;
type Tx = string;
type OptionsInput = Options | t.CmdPaths;
type Options = {
  paths?: t.CmdPaths;
  counter?: t.CmdCounterFactory;
  tx?: t.CmdTxFactory;
};

/**
 * Command factory.
 */
export function create<C extends t.CmdType>(
  transport: t.CmdImmutable,
  options?: OptionsInput,
): t.Cmd<C> {
  const doc = transport;
  const mutate = ObjectPath.mutate;
  const args = wrangle.options(options);
  const resolve = Path.resolver(args.paths);
  const paths = resolve.paths;
  const counter = args.counter ?? DEFAULTS.counter;

  const update = (tx: string, name: string, params: O, error?: t.Error, increment = false) => {
    doc.change((d) => {
      const count = resolve.counter(d, DEFAULTS.counter) as t.CmdCounter;
      mutate(d, paths.tx, tx);
      mutate(d, paths.name, name);
      mutate(d, paths.params, params);
      mutate(d, paths.error, error);
      if (increment) counter.increment(count);
    });
  };

  // Ensure document is initialized with the {cmd} structure.
  if (!Is.pathsObject(doc.current)) update('', '', {}); // ← (default empty structure).

  /**
   * Invoke method (overloads)
   */
  const invokeSetup = (tx: Tx, name: C['name'], params: C['params'], error?: t.Error) => {
    const res: t.CmdInvoked<any> = { tx, req: { name, params } };
    const start = () => Time.delay(0, () => update(tx, name, params, error, true));
    return { res, start } as const;
  };

  const invokeVoid: t.CmdInvoke<any> = (name, params, opt) => {
    const tx = wrangle.invoke.tx(opt, args.tx);
    const error = wrangle.invoke.error(opt);
    const { res, start } = invokeSetup(tx, name, params, error);
    start();
    return res;
  };

  const invokeResponder: t.CmdInvokeResponse<any, any> = (req, res, params, opt) => {
    const options = wrangle.invoke.responseOptions<any, any>(opt);
    const tx = wrangle.invoke.tx(options, args.tx);
    const error = wrangle.invoke.error(options);
    const { timeout, dispose$, onComplete, onError } = options;
    const { start } = invokeSetup(tx, req, params, error);
    const listener = Listener.create<any, any>(api, {
      tx,
      req: { name: req, params },
      res: { name: res },
      timeout,
      dispose$,
      onComplete,
      onError,
    });
    start();
    return listener;
  };

  const toVoidMethod = (req: C['name']): t.CmdMethodVoid<C> => {
    return (params, options) => invokeVoid<any>(req, params, options);
  };

  const toResponderMethod = (req: C['name'], res: C['name']): t.CmdMethodResponder<C, C> => {
    return (params, options) => invokeResponder(req, res, params, options) as any;
  };

  /**
   * API
   */
  const api: t.Cmd<C> = {
    events(dispose$?: t.UntilObservable) {
      return Events.create<C>(doc, { paths, dispose$ });
    },

    invoke(name, params, options) {
      return invokeVoid(name, params, options);
    },

    method(...args: any[]) {
      const [p1, p2] = args;
      return (typeof p2 !== 'string' ? toVoidMethod(p1) : toResponderMethod(p1, p2)) as any;
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
    tx<C extends t.CmdType>(input?: t.CmdInvokeOptions<C> | Tx, txFactory?: t.CmdTxFactory) {
      const defaultTx = () => (txFactory ?? DEFAULTS.tx)();
      if (!input) return defaultTx();
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input.tx) return input.tx;
      return defaultTx();
    },

    error<C extends t.CmdType>(input?: t.CmdInvokeOptions<C> | Tx): u.ExtractError<C> | undefined {
      return typeof input === 'object' ? input.error : undefined;
    },

    responseOptions<Req extends t.CmdType, Res extends t.CmdType>(
      input?: Tx | t.CmdResponseHandler<Req, Res> | t.CmdInvokeResponseOptions<Req, Res>,
    ): t.CmdInvokeResponseOptions<Req, Res> {
      if (!input) return {};
      if (typeof input === 'string') return {};
      if (typeof input === 'function') return { onComplete: input };
      return input;
    },
  },
} as const;
