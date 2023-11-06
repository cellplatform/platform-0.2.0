import { getItem } from './List.get';
import { PatchState, type t } from './common';

type O = Record<string, unknown>;
type K = t.LabelItemActionKind;

/**
 * Map over a list of items.
 *
 * NOTES:
 *   - A convenience function when transforming the List "cursor" (total/getItem)
 *   - Will produce a smaller result than the input list if [getItem] does not yield an item.
 */
export function map<T, A extends K = string, D extends O = O>(
  input: t.LabelList | t.LabelListState | undefined,
  fn: (item: t.LabelItemState<A, D>, index: number, total: number) => T,
): T[] {
  if (!input) return [];

  const list = PatchState.Is.state(input) ? input.current : input;
  const length = Math.max(0, list.total ?? 0);
  if (length === 0 || typeof list.getItem !== 'function') return [];

  return Array.from({ length })
    .map((_, i) => {
      const [item] = getItem<A, D>(list, i);
      return item ? fn(item, i, length) : undefined;
    })
    .filter(Boolean) as T[];
}
