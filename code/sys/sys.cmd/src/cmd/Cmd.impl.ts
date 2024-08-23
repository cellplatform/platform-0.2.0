import { DEFAULTS, Time, slug, type t, type u } from './common';
import { Events, Is, Path } from './u';
import { Listener } from './u.Listener';

type O = Record<string, unknown>;
type OptionsInput = Options | t.CmdPaths;
type Options = {
  tx?: t.CmdTxFactory;
  paths?: t.CmdPaths | t.ObjectPath;
  issuer?: t.IdString; // The identity (URI) of the issuer of the command.
};

/**
 * Command factory.
 */
export function create<C extends t.CmdType>(
  transport: t.CmdTransport,
  options?: OptionsInput,
): t.Cmd<C> {
  const args = wrangle.options(options);
  const resolve = Path.resolver(args.paths);
  const paths = resolve.paths;

  const push = (tx: t.TxString, name: string, params: O, issuer?: t.IdString, error?: t.Error) => {
    transport.change((d) => {
      const item = resolve.queue.item(d);
      item.name(name);
      item.params(params);
      item.tx(tx);
      item.id(`${slug()}`);
      if (error) item.error(error);
      if (issuer) item.issuer(issuer);
    });
  };

  // Ensure document is initialized with the {cmd} structure.
  if (!Is.state.cmd(transport.current)) {
    transport.change((d) => {
      resolve.log(d);
      resolve.queue.list(d);
    });
  }

  /**
   * Invoke method (overloads).
   */
  const invokeSetup = (
    tx: t.TxString,
    name: C['name'],
    params: C['params'],
    issuer?: t.IdString,
    error?: t.Error,
  ) => {
    const res: t.CmdInvoked<any> = { tx, issuer, req: { name, params } };
    const start = () => Time.delay(0, () => push(tx, name, params, issuer, error));
    return { res, start } as const;
  };

  const invokeVoid: t.CmdInvoke<any> = (name, params, opt) => {
    const tx = wrangle.invoke.tx(opt, args.tx);
    const issuer = wrangle.invoke.issuer(opt, args.issuer);
    const error = wrangle.invoke.error(opt);
    const { res, start } = invokeSetup(tx, name, params, issuer, error);
    start();
    return res;
  };

  const invokeResponder: t.CmdInvokeResponse<any, any> = (req, res, params, opt) => {
    const options = wrangle.invoke.responseOptions<any, any>(opt);
    const tx = wrangle.invoke.tx(options, args.tx);
    const issuer = wrangle.invoke.issuer(options, args.issuer);
    const error = wrangle.invoke.error(options);

    const { timeout, dispose$, onComplete, onError, onTimeout } = options;
    const { start } = invokeSetup(tx, req, params, issuer, error);
    const listener = Listener.create<any, any>(api, {
      tx,
      issuer,
      req: { name: req, params },
      res: { name: res },
      timeout,
      dispose$,
      onComplete,
      onError,
      onTimeout,
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
      return Events.create<C>(transport, { paths, dispose$ });
    },

    invoke(name, params, options) {
      return invokeVoid(name, params, options);
    },

    method(...args: any[]) {
      const [p1, p2] = args;
      return (typeof p2 !== 'string' ? toVoidMethod(p1) : toResponderMethod(p1, p2)) as any;
    },
  };

  /**
   * Store internal decorations.
   *    See related helpers:
   *      - Cmd.toTransport()
   *      - toPaths()
   *      - toIssuer() etc.
   */
  (api as any)[DEFAULTS.symbol.transport] = transport;
  (api as any)[DEFAULTS.symbol.paths] = paths;
  (api as any)[DEFAULTS.symbol.issuer] = args.issuer;
  return api;
}

/**
 * Helpers
 */
const wrangle = {
  options(input?: OptionsInput): Options {
    if (!input) return {};
    if (Path.Is.commandPaths(input)) return { paths: input };
    return input;
  },

  invoke: {
    tx(input?: t.CmdInvokeOptions<any> | t.TxString, txFactory?: t.CmdTxFactory) {
      const defaultTx = () => (txFactory ?? DEFAULTS.tx)();
      if (!input) return defaultTx();
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input.tx) return input.tx;
      return defaultTx();
    },

    error<C extends t.CmdType>(
      input?: t.CmdInvokeOptions<C> | t.TxString,
    ): u.ExtractError<C> | undefined {
      return typeof input === 'object' ? input.error : undefined;
    },

    issuer(
      input?: t.CmdInvokeOptions<any> | t.TxString,
      defaultIssuer?: t.IdString,
    ): t.IdString | undefined {
      return typeof input === 'object' ? input.issuer ?? defaultIssuer : defaultIssuer;
    },

    responseOptions<Req extends t.CmdType, Res extends t.CmdType>(
      input?: t.TxString | t.CmdResponseHandler<Req, Res> | t.CmdInvokeResponseOptions<Req, Res>,
    ): t.CmdInvokeResponseOptions<Req, Res> {
      if (!input) return {};
      if (typeof input === 'string') return {};
      if (typeof input === 'function') return { onComplete: input };
      return input;
    },
  },
} as const;
