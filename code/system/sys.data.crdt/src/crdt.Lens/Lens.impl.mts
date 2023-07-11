import { toObject } from '../crdt.helpers';
import { Registry } from './Lens.Registry.mjs';
import { DEFAULTS, Time, Wrangle, rx, type t } from './common';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<R extends {}, L extends {}>(
  root: t.CrdtDocRef<R>,
  get: t.CrdtLensGetDescendent<R, L>,
  options: { dispose$?: t.Observable<any> } = {},
): t.CrdtLens<R, L> {
  Registry.add(root);
  let _count = 0;

  const lifecycle = rx.lifecycle([root.dispose$, options.dispose$]);
  const { dispose, dispose$ } = lifecycle;
  dispose$.subscribe(() => {
    subject$.complete();
    Registry.remove(root);
  });

  const subject$ = new rx.Subject<t.CrdtLensChange<R, L>>();
  const $ = subject$.pipe(rx.takeUntil(dispose$));

  const fire = {
    fromChange(e: t.CrdtDocChange<R>) {
      const lens = api.current;
      subject$.next({ ...e, lens });
    },
    fromReplace(e: t.CrdtDocReplace<R>) {
      subject$.next({
        action: 'change',
        doc: e.doc,
        lens: api.current,
        info: { time: Time.now.timestamp },
      });
    },
  };

  let _changing = false;
  let _lastValue: L | undefined;

  // Monitor for changes made to the lens scope independently of this instance.
  root.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter(() => !_changing),
    rx.filter(() => _lastValue !== api.current),
  ).subscribe((e) => {
    if (e.action === 'change') fire.fromChange(e);
    if (e.action === 'replace') fire.fromReplace(e);
    _lastValue = api.current;
  });

  /**
   * API
   */
  const api: t.CrdtLens<R, L> = {
    kind: 'Crdt:Lens',
    root,
    $,

    /**
     * Current value of the descendent.
     */
    get current() {
      return get(root.current);
    },

    /**
     * Immutable change mutation on the descendent.
     */
    change(...args: []) {
      if (api.disposed) return api;
      _changing = true;
      const { message, fn } = Wrangle.changeArgs<R, L>(args);

      // NB: forces the [get] factory to initialize the descendent if necessary.
      if (_count === 0) {
        root.change(DEFAULTS.ensureLensMessage, (draft) => {
          /**
           * HACK: The `get` function is called for the total
           *       number of current lens instances to ensure that
           *       all sub-trees each lens getter may create are
           *       correctly initialized.
           */
          const length = Registry.total(root) + 1;
          Array.from({ length }).forEach(() => get(draft));
        });
      }

      let _fired: t.CrdtDocChange<R> | undefined;
      root.$.pipe(
        rx.filter((e) => e.action === 'change'),
        rx.take(1),
      ).subscribe((e) => {
        _fired = e as t.CrdtDocChange<R>;
      });

      // Perform change.
      const mutate: t.CrdtMutator<R> = (draft: R) => {
        const child = get(draft);
        fn(child);
      };
      if (message) root.change(message, mutate);
      if (!message) root.change(mutate);

      // Alert listeners.
      if (_fired) fire.fromChange(_fired);

      // Finish up.
      _count++;
      _lastValue = api.current;
      _changing = false;
      return api;
    },

    /**
     * Create a new sub-lens.
     */
    lens<T extends {}>(fn: t.CrdtLensGetDescendent<L, T>) {
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
      return lifecycle.disposed;
    },
  };

  api.change(() => null); // NB: Ensure the lens is initialized.
  _lastValue = api.current;
  return api;
}
