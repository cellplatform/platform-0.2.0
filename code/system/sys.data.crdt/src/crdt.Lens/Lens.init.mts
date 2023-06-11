import { R, Time, rx, type t } from '../common';
import { Wrangle } from '../crdt.DocRef/Wrangle.mjs';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<D extends {}, C extends {}>(
  root: t.CrdtDocRef<D>,
  get: t.CrdtLensDescendent<D, C>,
  options: { dispose$?: t.Observable<any> } = {},
): t.CrdtLens<D, C> {
  let _count = 0;

  const lifecycle = rx.lifecycle([root.dispose$, options.dispose$]);
  const { dispose, dispose$ } = lifecycle;
  dispose$.subscribe(() => subject$.complete());

  const subject$ = new rx.Subject<t.CrdtLensChange<D, C>>();
  const $ = subject$.pipe(rx.takeUntil(dispose$));

  const fireFromChange = (e: t.CrdtDocChange<D>) => {
    const lens = api.current;
    subject$.next({ ...e, lens });
  };

  const fireFromReplace = (e: t.CrdtDocReplace<D>) => {
    subject$.next({
      action: 'change',
      doc: e.doc,
      lens: api.current,
      info: { time: Time.now.timestamp },
    });
  };

  let _changing = false;
  let _lastValue: C | undefined;
  const isChanged = () => !R.equals(_lastValue, api.current);

  // Monitor for changes made to the lens scope independently of this instance.
  root.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter(() => !_changing),
    rx.filter(isChanged),
  ).subscribe((e) => {
    if (e.action === 'change') fireFromChange(e);
    if (e.action === 'replace') fireFromReplace(e);
    _lastValue = api.current;
  });

  /**
   * API
   */
  const api: t.CrdtLens<D, C> = {
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
      const { message, fn } = Wrangle.changeArgs<D, C>(args);

      const mutate: t.CrdtMutator<D> = (draft: D) => {
        const child = get(draft);
        fn(child);
      };

      // NB: forces the [get] factory to initialize the descendent if necessary.
      if (_count === 0) root.change('(sys): ensure lens descendent', (draft) => get(draft));

      let _fired: t.CrdtDocChange<D> | undefined;
      root.$.pipe(
        rx.filter((e) => e.action === 'change'),
        rx.take(1),
      ).subscribe((e) => {
        _fired = e as t.CrdtDocChange<D>;
      });

      // Perform change.
      if (message) root.change(message, mutate);
      if (!message) root.change(mutate);

      // Alert listeners.
      if (_fired) fireFromChange(_fired);

      // Finish up.
      _count++;
      _lastValue = api.current;
      _changing = false;
      return api;
    },

    /**
     * Create a new sub-lens.
     */
    lens<T extends {}>(get: t.CrdtLensDescendent<C, T>) {
      return init(root, (doc) => get(api.current), { dispose$ });
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

  _lastValue = api.current;
  return api;
}
