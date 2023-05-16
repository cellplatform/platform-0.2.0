import { t } from '../common';
import { Wrangle } from '../crdt.DocRef/Wrangle.mjs';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export function init<D extends {}, C extends {}>(
  root: t.CrdtDocRef<D>,
  get: t.CrdtLensDescendent<D, C>,
): t.CrdtLens<D, C> {
  let _count = 0;

  const api: t.CrdtLens<D, C> = {
    kind: 'Crdt:Lens',
    root,

    get current() {
      return get(root.current);
    },

    change(...args: []) {
      if (root.disposed) return api;
      const { message, fn } = Wrangle.changeArgs<D, C>(args);

      const mutate: t.CrdtMutator<D> = (draft: D) => {
        const child = get(draft);
        fn(child);
      };

      // NB: forces the [get] factory to initialize the descendent if necessary.
      if (_count === 0) root.change('(sys): ensure lens descendent', (draft) => get(draft));

      // Perform change.
      if (message) root.change(message, mutate);
      if (!message) root.change(mutate);

      _count++;
      return api;
    },
  };

  return api;
}
