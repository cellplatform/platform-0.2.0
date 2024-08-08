import { rx, type t, type u } from './common';
import { Patch } from './u.Patch';
import { Path } from './u.Path';

type Options = {
  paths?: t.CmdPaths;
  dispose$?: t.UntilObservable;
};

/**
 * Strongly typed events for an abstract CRDT document that has
 * paths within it representing a <Cmd> (Command).
 */
export const Events = {
  /**
   * Events factory.
   */
  create<C extends t.CmdType>(doc?: t.CmdTransport, options: Options = {}): t.CmdEvents<C> {
    const resolve = Path.resolver(options.paths);
    const paths = resolve.paths;
    const life = rx.lifecycle(options.dispose$);
    const { dispose, dispose$ } = life;

    /**
     * Observables.
     */
    const fire = (e: t.CmdEvent) => fire$.next(e);
    const fire$ = rx.subject<t.CmdEvent>();
    const $ = fire$.pipe(rx.takeUntil(dispose$));
    const tx$ = rx.payload<t.CmdTxEvent<C>>($, 'sys.cmd/tx');
    const error$ = tx$.pipe(rx.filter((e) => !!e.error));

    if (doc) {
      const events = doc.events(dispose$);
      const $ = events.changed$.pipe(
        rx.map((e) => {
          const { patches, after } = e;
          return { patches, doc: resolve.toObject(after) };
        }),
      );

      // Tx (Command) ⚡️.
      $.pipe(
        rx.filter((e) => Patch.includesQueueChange(e.patches, paths)),
        rx.distinctWhile((p, n) => p.doc.queue.length === n.doc.queue.length),
        rx.filter((e) => e.doc.queue.length > 0),
      ).subscribe((e) => {
        const queue = e.doc.queue ?? [];
        const { tx, name, params, error } = queue[queue.length - 1];
        fire({
          type: 'sys.cmd/tx',
          payload: { tx, name, params, error },
        });
      });
    }

    /**
     * API
     */
    const api: t.CmdEvents<C> = {
      $,
      tx$,
      error$,

      on<N extends C['name']>(name: N, handler?: t.CmdEventsOnHandler<u.CmdTypeMap<C>[N]>) {
        type M = u.CmdTypeMap<C>[N];
        type T = t.CmdTx<M>;
        const res$ = api.tx$.pipe(rx.filter((e) => e.name === name)) as t.Observable<T>;
        if (handler) res$.subscribe((e) => handler(e));
        return res$;
      },

      // Lifecycle.
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },
} as const;
