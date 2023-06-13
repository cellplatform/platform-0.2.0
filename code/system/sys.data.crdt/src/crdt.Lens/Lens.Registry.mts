import { type t } from './common';

type Id = string;
type Doc = t.CrdtDocRef<any>;
type RegistryEntry = { total: number };

const store = new Map<Id, RegistryEntry>();

/**
 * A registry of all current Lens instances.
 *
 * NOTES:
 *    Keeping track of the instance count is required
 *    within the lens so that when changing, the lens
 *    knows how many times it needs to run it's initial
 *    "get" function to ensure the entire sub-tree that
 *    all lens's may constructing accurately completes.
 *
 */
export const Registry = {
  total(root: Doc) {
    return Registry.get(root)?.total || 0;
  },

  get(root: Doc) {
    return store.get(Wrangle.id(root));
  },

  add(root: Doc) {
    const id = Wrangle.id(root);
    if (store.has(id)) {
      const entry = store.get(id)!;
      const total = entry.total + 1;
      store.set(id, { ...entry, total });
    } else {
      store.set(id, { total: 1 });
    }
    return store.get(id)!;
  },

  remove(root: Doc) {
    const id = Wrangle.id(root);
    const entry = store.get(id)!;
    if (!entry) return;

    const total = entry.total - 1;
    if (total <= 0) {
      store.delete(id);
    } else {
      store.set(id, { ...entry, total });
    }
  },
};

/**
 * Helpers
 */
const Wrangle = {
  id(doc: Doc) {
    return `${doc.id.actor}:${doc.id.doc}`;
  },
};
