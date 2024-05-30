import { DEFAULTS, Time, rx, type t, type u } from './common';

type Args<C extends t.CmdType> = {
  tx: string;
  name: u.ExtractResName<C>;
  timeout?: t.Msecs;
  onComplete?: t.CmdListenerHandler<C>;
  dispose$?: t.UntilObservable;
};

/**
 * Factory for producing callback listeners.
 */
export function listenerFactory<C extends t.CmdType>(
  cmd: t.Cmd<C>,
  args: Args<C>,
): t.CmdListener<C> {
  const { tx, timeout = DEFAULTS.timeout } = args;
  const life = rx.lifecycle(args.dispose$);
  const { dispose, dispose$ } = life;
  const events = cmd.events(dispose$);

  type Status = t.CmdListener<C>['status'];
  type ResParams = u.ExtractResParams<C>;
  let _result: ResParams | undefined;
  let _status: Status = 'Pending';

  const handlers = { onComplete: new Set<t.CmdListenerHandler<C>>() } as const;
  if (args.onComplete) handlers.onComplete.add(args.onComplete);

  /**
   * Finalization
   */
  const timer = Time.delay(timeout, () => done('Error:Timeout'));
  const done = (status: Status, result?: ResParams | undefined) => {
    timer.cancel();
    _result = result;
    _status = status;
    if (result) $$.next(result);
    $$.complete();
    api.dispose();
    if (status === 'Complete') handlers.onComplete.forEach((fn) => fn(api));
  };

  /**
   * Observables.
   */
  const $$ = rx.subject<ResParams>();
  const $ = $$.pipe(rx.takeUntil(life.dispose$));

  /**
   * Listeners.
   */
  events
    .on(args.name)
    .pipe(
      rx.filter((e) => e.tx === tx),
      rx.map((e) => e.params as ResParams),
    )
    .subscribe((result) => done('Complete', result));

  /**
   * API
   */
  const api: t.CmdListener<C> = {
    $,
    tx,

    get ok() {
      if (_status === 'Error') return false;
      if (_status === 'Error:Timeout') return false;
      return true;
    },
    get status() {
      return _status;
    },
    get timedout() {
      return _status === 'Error:Timeout';
    },
    get result() {
      return _result;
    },

    promise() {
      const first$ = $.pipe(rx.take(1));
      return new Promise<t.CmdListener<C>>((resolve) => first$.subscribe((e) => resolve(api)));
    },

    onComplete(fn) {
      handlers.onComplete.add(fn);
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
