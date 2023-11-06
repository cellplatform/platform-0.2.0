import { PatchState, type t } from './common';

type ItemId = string;
type O = Record<string, unknown>;
type ListInput = t.LabelList | t.LabelListState;

/**
 * Retrieve an item from a list via [index] or [Item] reference.
 */
export function getItem<A extends t.LabelItemActionKind = string, D extends O = O>(
  list: ListInput | undefined,
  index: number,
): t.LabelItemStateIndex<A, D> {
  const notFound: t.LabelItemStateIndex<A, D> = [undefined, -1];
  if (!list) return notFound;

  const current = PatchState.Is.state(list) ? list.current : list;
  if (!current?.getItem) return notFound;
  if (index < 0 || index > current.total - 1) return notFound;
  if (!Number.isInteger(index)) throw new Error('Index is not an integer');

  const res = current.getItem(index);
  return res ? (res as t.LabelItemStateIndex<A, D>) : notFound;
}

/**
 * Convenience API for working with [getItem]
 */
export function get<A extends t.LabelItemActionKind = string, D extends O = O>(list: ListInput) {
  return {
    item(index: number) {
      const [item] = getItem<A, D>(list, index);
      return item;
    },
    index(input?: t.LabelItemState | ItemId | t.LabelListEdge | number) {
      if (input === undefined) return -1;
      if (typeof input === 'number') return input;
      if (input === 'First') return 0;

      const id = typeof input === 'object' ? input.instance : input;
      if (typeof id !== 'string') return -1;

      const current = PatchState.Is.state(list) ? list.current : list;
      if (id === 'Last') return current.total - 1;
      return current.getItem ? current.getItem(id)[1] : -1;
    },
  } as const;
}
