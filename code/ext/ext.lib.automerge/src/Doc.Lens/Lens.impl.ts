import { eventsFactory } from './Lens.Events';
import { Registry } from './Lens.Registry';
import { Path, rx, slug, toObject, type t } from './common';

type O = Record<string, unknown>;
type Options<R extends O> = {
  init?: t.LensInitial<R>;
  typename?: string;
  dispose$?: t.UntilObservable;
};

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<R extends O, L extends O>(
  root: t.DocRef<R>,
  path?: t.JsonPath | (() => t.JsonPath),
  options?: Options<R> | t.LensInitial<R>,
): t.Lens<L> {
  const args = wrangle.options<R>(options);

  Registry.add(root);
  let _count = 0;
  let _changing = false;
  let _lastValue: L | undefined;

  const resolve = (root: R) => Path.resolve<L>(root, wrangle.path(path))!;
  const events = root.events(args.dispose$);

  events.dispose$.subscribe(() => {
    subject$.complete();
    Registry.remove(root);
  });
  const subject$ = rx.subject<t.LensEvent<L>>();
  const { dispose, dispose$ } = events;

  const fire = {
    changed(e: t.DocChanged<R>) {
      const before = resolve(e.patchInfo.before);
      const after = resolve(e.patchInfo.after);
      const patches = wrangle.patches(e.patches, path);
      subject$.next({
        type: 'crdt:lens:changed',
        payload: { before, after, patches },
      });
    },
    deleted(e: t.DocDeleted<R>) {
      const before = resolve(e.doc);
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
      fire.changed(e);
      _lastValue = api.current;
    });

  events.deleted$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
    fire.deleted(e);
    dispose();
  });

  /**
   * API
   */
  const api: t.Lens<L> = {
    instance: `${root.uri}:lens.${slug()}`,
    typename: args.typename,

    /**
     * Current value of the descendent.
     */
    get current() {
      return resolve(root.current);
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
          Array.from({ length }).forEach(() => resolve(draft));
        });
      }

      let _fired: t.DocChanged<R> | undefined;
      events.changed$.pipe(rx.take(1)).subscribe((e) => (_fired = e as t.DocChanged<R>));

      // Perform change.
      root.change((d) => fn(resolve(d)));

      // Alert listeners.
      if (_fired) fire.changed(_fired);

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
    lens<T extends O>(subpath: t.JsonPath, fn?: t.LensInitial<L>) {
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
  if (typeof resolve(root.current) !== 'object') {
    const fn = args.init;
    if (typeof fn === 'function') root.change((d) => fn(d));
    if (typeof resolve(root.current) !== 'object') {
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
  options<R extends O>(input?: Options<R> | t.LensInitial<R>): Options<R> {
    if (typeof input === 'function') return { init: input };
    return input ?? {};
  },

  path(path?: t.JsonPath | (() => t.JsonPath)) {
    return typeof path === 'function' ? path() : path ?? [];
  },

  patches(patches: t.Patch[], path?: t.JsonPath | (() => t.JsonPath)) {
    const length = wrangle.path(path).length;
    return patches.map((patch) => ({ ...patch, path: patch.path.slice(length) }));
  },
} as const;
