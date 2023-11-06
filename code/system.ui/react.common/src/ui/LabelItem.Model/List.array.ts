import { type t } from './common';
import { Item } from './Item';

type O = Record<string, unknown>;
type K = t.LabelItemActionKind;
type FactoryOrInitial<A extends K = string, D extends O = O> =
  | t.LabelItem<A, D>
  | ((index: number) => t.LabelItemState<A, D>);

/**
 * Helper for managing a set of items with a simple array.
 *
 * NOTE:
 *    Useful when the list is not very long and you
 *    do not need a complex structure like a cursor.
 */
export function array<A extends K = string, D extends O = O>(input?: FactoryOrInitial<A, D>) {
  const items: t.LabelItemState<A, D>[] = [];
  const getItem: t.GetLabelItem<A, D> = (target) => {
    if (typeof target === 'number') {
      const item = items[target] ?? (items[target] = create(target, input));
      return [item, target];
    } else {
      const index = items.findIndex((item) => item.instance === target);
      return [items[index], index];
    }
  };
  const api: t.LabelListArray<A, D> = {
    items,
    getItem,

    get length() {
      return items.length;
    },
    get first() {
      return items[0];
    },
    get last() {
      return items[items.length - 1];
    },

    map<T>(fn: t.LabelItemTransform<T, A, D>) {
      const result: T[] = [];
      for (let i = 0; i < api.length; i++) {
        result[i] = fn(getItem(i)[0]!, i, items);
      }
      return result;
    },

    fill(total) {
      if (total >= 0) getItem(total - 1);
      api.map(() => null);
      return api;
    },

    /**
     * NOTE: Can be inefficient if this is a large array.
     *       But if it is a large array, consider using your own data
     *       structure to manage the list (aka a "cursor").
     */
    remove(target) {
      if (target !== undefined) {
        const [, index] = getItem(target);
        items.splice(index, 1);
      }
      return api;
    },
  };
  return api;
}

/**
 * Helpers
 */
function create<A extends K = string, D extends O = O>(
  index: number,
  input?: FactoryOrInitial<A, D>,
) {
  return typeof input === 'function' ? input(index) : Item.state<A, D>(input);
}
