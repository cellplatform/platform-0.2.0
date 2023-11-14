import { PatchState, type t } from './common';

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
