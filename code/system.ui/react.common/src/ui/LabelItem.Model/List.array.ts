import { type t } from './common';
import { Item } from './Item';

type O = Record<string, unknown>;
type K = t.LabelItemActionKind;
type FactoryOrInitial<A extends K = string, D extends O = O> =
  | t.LabelItem<A, D>
  | (() => t.LabelItemState<A, D>);

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
      const item = items[target] ?? (items[target] = create(input));
      return [item, target];
    } else {
      const index = items.findIndex((item) => item.instance === target);
      return [items[index], index];
    }
  };
  return {
    items,
    getItem,

    /**
     * Helpers
     */
    get length() {
      return items.length;
    },
    get first() {
      return items[0];
    },
    get last() {
      return items[items.length - 1];
    },
  } as const;
}

/**
 * Helpers
 */
function create<A extends K = string, D extends O = O>(input?: FactoryOrInitial<A, D>) {
  return typeof input === 'function' ? input() : Item.state<A, D>(input);
}
