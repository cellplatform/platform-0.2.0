import { PatchState, type t } from './common';
import { getItem } from './List.getItem';

type O = Record<string, unknown>;
type ListInput = t.LabelList | t.LabelListState;

/**
 * Convenience API for working with [getItem]
 */
export function get<A extends t.LabelItemActionKind = string, D extends O = O>(list?: ListInput) {
  return {
    /**
     * Find the ListItem object.
     */
    item(input?: t.LabelItemState | t.LabelListItemTarget) {
      if (!list || input === undefined || input === null) return undefined;
      if (typeof input === 'object') return input;

      if (typeof input === 'string' && !(input === 'First' || input === 'Last')) {
        const current = PatchState.Is.state(list) ? list.current : list;
        const res = current.getItem?.(input);
        return res ? res[0] : undefined;
      }

      let index = -1;
      if (typeof input === 'number') {
        index = input;
      } else if (typeof input === 'string') {
        if (input === 'First') index = 0;
        else if (input === 'Last') {
          const current = PatchState.Is.state(list) ? list.current : list;
          index = current.total - 1;
        }
      }

      const [item] = getItem<A, D>(list, index);
      return item;
    },

    /**
     * Find the ListItem index.
     */
    index(input?: t.LabelItemState | t.LabelListItemTarget) {
      if (!list || input === undefined || input === null) return -1;
      if (input === 'First') return 0;
      if (typeof input === 'number') {
        if (!Number.isInteger(input)) throw new Error('Index is not an integer');
        return input;
      }

      const id = typeof input === 'object' ? input.instance : input;
      if (typeof id !== 'string') return -1;

      const current = PatchState.Is.state(list) ? list.current : list;
      if (id === 'Last') return current.total - 1;
      return current.getItem ? current.getItem(id)[1] : -1;
    },
  } as const;
}
