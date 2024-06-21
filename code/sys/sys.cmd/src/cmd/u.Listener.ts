import { DEFAULTS, Time, rx, type t, type u } from './common';

type Args<Req extends t.CmdType, Res extends t.CmdType> = {
  tx: string;
  req: { name: Req['name']; params: Req['params'] };
  res: { name: Res['name'] };
  timeout?: t.Msecs;
  dispose$?: t.UntilObservable;
  onComplete?: t.CmdResponseHandler<Req, Res>;
  onError?: t.CmdResponseHandler<Req, Res>;
};

/**
 * Factory for producing callback listeners.
 */
function create<Req extends t.CmdType, Res extends t.CmdType>(
  cmd: t.Cmd<Res>,
  args: Args<Req, Res>,
): t.CmdResponseListener<Req, Res> {
  const { tx, timeout = DEFAULTS.timeout } = args;
  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;
  const events = cmd.events(dispose$);

  type L = t.CmdResponseListener<Req, Res>;
  type Status = L['status'];
  type R = Res['params'];
  type E = u.ExtractError<Res>;
  let _status: Status = 'Pending';
  let _result: R | undefined;
  let _error: E | undefined;

  type H = t.CmdResponseHandler<Req, Res>;
  const handlers = { complete: new Set<H>(), error: new Set<H>() } as const;
  if (args.onComplete) handlers.complete.add(args.onComplete);
  if (args.onError) handlers.error.add(args.onError);

  const Handlers = {
    run(handlers: Set<H>) {
      const e = Handlers.args();
      handlers.forEach((fn) => fn(e));
    },
    args(): t.CmdResponseHandlerArgs<Req, Res> {
      const { ok, tx, result, error } = api;
      return { ok, tx, result, error };
    },
  } as const;

  /**
   * Finalization
   */
  const timer = Time.delay(timeout, () => done('Timeout'));
  const done = (status: Status, result?: R, error?: E) => {
    timer.cancel();
    _status = status;
    _result = result;
    _error = error;
    if (result) $$.next(result);
    $$.complete();
    api.dispose();
    if (status === 'Complete') Handlers.run(handlers.complete);
    if (status === 'Error') Handlers.run(handlers.error);
  };

  /**
   * Observables.
   */
  const $$ = rx.subject<R>();
  const $ = $$.pipe(rx.takeUntil(life.dispose$));

  /**
   * Listeners.
   */
  events
    .on(args.res.name)
    .pipe(rx.filter((e) => e.tx === tx))
    .subscribe((e) => done(e.error ? 'Error' : 'Complete', e.params, e.error));

  /**
   * API
   */
  const api: L = {
    $,
    tx,
    req: args.req,

    get ok() {
      if (_status === 'Error' || _status === 'Timeout') return false;
      if (_error) return false;
      return true;
    },
    get status() {
      return _status;
    },
    get result() {
      return _result;
    },
    get error() {
      return _error;
    },

    promise() {
      const first$ = $.pipe(rx.take(1));
      return new Promise<L>((resolve) => first$.subscribe(() => resolve(api)));
    },

    onComplete(fn) {
      handlers.complete.add(fn);
      return api;
    },

    onError(fn) {
      handlers.error.add(fn);
      return api;
    },

    // Lifecycle.
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  };
  return api;
}

/**
 * Export
 */
export const Listener = { create } as const;