import { rx, type t } from './common';
import { EventsIs as Is } from './u.Events.Is';
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
  Is,

  /**
   * Events factory.
   */
  create<C extends t.CmdTx>(doc?: t.Lens | t.DocRef, options: Options = {}): t.CmdEvents<C> {
    const resolve = Path.resolver(options.paths);
    const paths = resolve.paths;
    const life = rx.lifecycle(options.dispose$);
    const { dispose, dispose$ } = life;
    const { distinctWhile, filter, map } = rx;

    /**
     * Observables.
     */
    const $$ = rx.subject<t.CmdEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.CmdEvent) => $$.next(e);

    if (doc) {
      const events = doc.events(dispose$);
      const $ = events.changed$.pipe(
        map((e) => ({ patches: e.patches, doc: resolve.toObject(e.after) })),
      );

      // Tx (Command) ⚡️.
      $.pipe(
        filter((e) => Is.countChange(paths, e.patches)),
        distinctWhile((p, n) => p.doc.count === n.doc.count),
      ).subscribe((e) => {
        const { count, name, params } = e.doc;
        fire({ type: 'crdt:cmd/tx', payload: { name, params, count } });
      });
    }

    /**
     * API
     */
    type TxEvent = t.CmdTxEvent<C['name'], C['params']>;
    return {
      $,
      tx$: rx.payload<TxEvent>($, 'crdt:cmd/tx'),

      // Lifecycle.
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
  },
} as const;
