import { Registry } from './Lens.Registry';
import { rx, toObject, type t } from './common';
import { eventsFactory } from './Lens.Events';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<R extends {}, L extends {}>(
  root: t.DocRef<R>,
  get: t.LensGetDescendent<R, L>,
  options: { dispose$?: t.UntilObservable } = {},
) {
  Registry.add(root);
  let _count = 0;
  let _changing = false;
  let _lastValue: L | undefined;
  const events = root.events(options.dispose$);

  const { dispose, dispose$ } = events;
  events.dispose$.subscribe(() => {
    subject$.complete();
    Registry.remove(root);
  });

  const subject$ = rx.subject<t.LensEvent<R, L>>();

  const Fire = {
    changed(e: t.DocChanged<R>) {
      subject$.next({
        type: 'crdt:lens:changed',
        payload: { ...e, lens: api.current },
      });
    },
    deleted(e: t.DocDeleted<R>) {
      subject$.next({
        type: 'crdt:lens:deleted',
        payload: { ...e, lens: api.current },
      });
    },
  } as const;

  // Monitor for changes made to the lens scope independently of this instance.
  events.changed$
    .pipe(
      rx.takeUntil(dispose$),
      rx.filter(() => !_changing),
      rx.filter(() => _lastValue !== api.current),
    )
    .subscribe((e) => {
      Fire.changed(e);
      _lastValue = api.current;
    });

  events.deleted$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
    Fire.deleted(e);
    dispose();
  });

  /**
   * API
   */
  const api: t.Lens<R, L> = {
    root,

    /**
     * Current value of the descendent.
     */
    get current() {
      return get(root.current);
    },

    /**
     * Immutable change mutation on the descendent.
     */
    change(fn) {
      if (api.disposed) return api;
      _changing = true;

      // NB: forces the [get] factory to initialize the descendent if necessary.
      if (_count === 0) {
        root.change((draft) => {
          /**
           * HACK: The `get` function is called for the total
           *       number of current lens instances to ensure that
           *       all sub-trees lens getters are correctly initialized.
           */
          const length = Registry.total(root) + 1;
          Array.from({ length }).forEach(() => get(draft));
        });
      }

      let _fired: t.DocChanged<R> | undefined;
      events.changed$.pipe(rx.take(1)).subscribe((e) => (_fired = e as t.DocChanged<R>));

      // Perform change.
      root.change((d) => fn(get(d)));

      // Alert listeners.
      if (_fired) Fire.changed(_fired);

      // Finish up.
      _lastValue = api.current;
      _changing = false;
      _count++;
      return api;
    },

    /**
     * Create new events observer.
     */
    events(dispose$?: t.UntilObservable) {
      return eventsFactory(subject$, { dispose$: [dispose$, events.dispose$] });
    },

    /**
     * Create a new sub-lens from the current lens.
     */
    lens<T extends {}>(fn: t.LensGetDescendent<L, T>) {
      return init(root, (doc) => fn(get(doc)), { dispose$ });
    },

    /**
     * Convert the current lens state to a plain object.
     */
    toObject() {
      return toObject(api.current);
    },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return events.disposed;
    },
  };

  api.change(() => null); // NB: Ensure the lens is initialized.
  _lastValue = api.current;
  return api;
}
