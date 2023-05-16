import { t, rx } from '../common';
import { Wrangle } from '../crdt.DocRef/Wrangle.mjs';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<D extends {}, C extends {}>(
  root: t.CrdtDocRef<D>,
  get: t.CrdtLensDescendent<D, C>,
): t.CrdtLens<D, C> {
  let _count = 0;

  let _disposed = false;
  const { dispose, dispose$ } = rx.disposable(root.dispose$);
  dispose$.subscribe(() => {
    subject$.complete();
    _disposed = true;
  });

  const subject$ = new rx.Subject<t.CrdtLensChange<D, C>>();
  const $ = subject$.pipe(rx.takeUntil(dispose$));

  const api: t.CrdtLens<D, C> = {
    kind: 'Crdt:Lens',
    root,
    $,

    get current() {
      return get(root.current);
    },

    change(...args: []) {
      if (api.disposed) return api;
      const { message, fn } = Wrangle.changeArgs<D, C>(args);

      const mutate: t.CrdtMutator<D> = (draft: D) => {
        const child = get(draft);
        fn(child);
      };

      // NB: forces the [get] factory to initialize the descendent if necessary.
      if (_count === 0) root.change('(sys): ensure lens descendent', (draft) => get(draft));

      let _fired: t.CrdtDocChange<D> | undefined = undefined;
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
      if (_fired) {
        subject$.next({ ...(_fired as t.CrdtDocChange<D>), lens: api.current });
      }

      _count++;
      return api;
    },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return _disposed;
    },
  };

  return api;
}
