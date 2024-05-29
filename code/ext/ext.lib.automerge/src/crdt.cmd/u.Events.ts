import { rx, type t } from './common';
import { Is } from './u.Is';
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
  create<C extends t.CmdType>(doc?: t.Lens | t.DocRef, options: Options = {}): t.CmdEvents<C> {
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
        filter((e) => Is.event.countChange(paths, e.patches)),
        distinctWhile((p, n) => p.doc.count === n.doc.count),
      ).subscribe((e) => {
        const { count, name, params, tx } = e.doc;
        fire({
          type: 'crdt:cmd/Invoked',
          payload: { name, params, count, tx },
        });
      });
    }

    /**
     * API
     */
    const api: t.CmdEvents<C> = {
      $,
      invoked$: rx.payload<t.CmdInvokedEvent<C>>($, 'crdt:cmd/Invoked'),
      name<N extends C['name']>(name: N) {
        type T = t.CmdInvoked<t.CmdTypeMap<C>[N]>;
        return api.invoked$.pipe(rx.filter((e) => e.name === name)) as t.Observable<T>;
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
