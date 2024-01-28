import { eventsFactory } from './Lens.Events';
import { Registry } from './Lens.Registry';
import { Path, rx, slug, toObject, type t } from './common';

type Options<R extends {}> = {
  init?: t.LensInitial2<R>;
  typename?: string;
  dispose$?: t.UntilObservable;
};

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<R extends {}, L extends {}>(
  root: t.DocRef<R>,
  path?: t.JsonPath | (() => t.JsonPath),
  options?: Options<R> | t.LensInitial2<R>,
) {
  const args = wrangle.options<R>(options);

  Registry.add(root);
  let _count = 0;
  let _changing = false;
  let _lastValue: L | undefined;

  const get = (root: R) => Path.resolve<L>(root, wrangle.path(path))!;
  const events = root.events(args.dispose$);

  events.dispose$.subscribe(() => {
    subject$.complete();
    Registry.remove(root);
  });
  const subject$ = rx.subject<t.LensEvent<L>>();
  const { dispose, dispose$ } = events;

  const Fire = {
    changed(e: t.DocChanged<R>) {
      const before = get(e.patchInfo.before);
      const after = get(e.patchInfo.after);
      subject$.next({
        type: 'crdt:lens:changed',
        payload: { before, after },
      });
    },
    deleted(e: t.DocDeleted<R>) {
      const before = get(e.doc);
      const after = undefined;
      subject$.next({
        type: 'crdt:lens:deleted',
        payload: { before, after },
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
  const api: t.Lens2<L> = {
    instance: `${root.uri}:lens.${slug()}`,
    typename: args.typename,

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
      if (api.disposed) return;
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
    lens<T extends {}>(subpath: t.JsonPath, fn?: t.LensInitial2<L>) {
      const composite = [...wrangle.path(path), ...subpath];
      if (fn && typeof Path.resolve(root, composite) !== 'object') api.change((d) => fn(d));
      return init<R, T>(root, composite, { dispose$ });
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

  /**
   * Initialize.
   */
  if (typeof get(root.current) !== 'object') {
    const fn = args.init;
    if (typeof fn === 'function') root.change((d) => fn(d));
    if (typeof get(root.current) !== 'object') {
      const pathstring = wrangle.path(path).join('/');
      throw new Error(`Target path of [Lens] is not an object: [${pathstring}]`);
    }
  }

  api.change(() => null); // NB: Ensure the lens is initialized.
  _lastValue = api.current;

  return api;
}

/**
 * Helpers
 */
const wrangle = {
  options<R extends {}>(input?: Options<R> | t.LensInitial2<R>): Options<R> {
    if (typeof input === 'function') return { init: input };
    return input ?? {};
  },

  path(path?: t.JsonPath | (() => t.JsonPath)) {
    return typeof path === 'function' ? path() : path ?? [];
  },
} as const;
