import { rx, type t, type u } from './common';
import { Patch } from './u.Patch';
import { Path } from './u.Path';

type TxString = string;
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
      let _lastProcessed = '';
      $.pipe(
        rx.filter((e) => Patch.includesQueueChange(e.patches, paths)),
        rx.distinctWhile((p, n) => p.doc.queue.length === n.doc.queue.length),
        rx.filter((e) => e.doc.queue.length > 0),
      ).subscribe((e) => {
        /**
         * NOTE: on each change a new batch of events is fired running
         *       back to the last Tx that was processed.
         *       This is required as the CRDT might update itself unevently
         *       (for instance, when a batch of changes is synced over the network)
         *       and so this looks to the [queue] array itself as the source of
         *       truth (not this change event) and fires accordingly.
         */
        const queue = e.doc.queue ?? [];
        const list = Events.unprocessed(queue, _lastProcessed);
        _lastProcessed = queue[queue.length - 1].id || '';
        list.forEach(({ tx, id, name, params, error }) => {
          fire({
            type: 'sys.cmd/tx',
            payload: { tx, id, name, params, error },
          });
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

  /**
   * Scan back in a queue and find the given <last> item and
   * return the set from that point on.
   */
  unprocessed(queue: t.CmdQueue, lastProcessed: string): t.CmdQueue {
    if (queue.length === 0) return [];
    if (!lastProcessed) return [queue[queue.length - 1]].filter(Boolean);
    const index = queue.findLastIndex((m) => m.id === lastProcessed);
    return index < 0 ? queue : queue.slice(index + 1);
  },
} as const;
