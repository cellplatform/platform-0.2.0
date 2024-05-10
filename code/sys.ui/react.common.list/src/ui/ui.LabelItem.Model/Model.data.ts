import { Is, Patch, PatchState, type t } from './common';

type O = Record<string, unknown>;

/**
 * Retrieves, or ensures the {data} object exists on the
 * given draft/proxy object.
 * Note:
 *    When called within a proxy, the object is ensured to exist.
 *    To simply read with no mutation, call outside of a [change] function.
 */
export function data<T extends O>(
  input: t.LabelItem | t.LabelItemState | t.LabelList | t.LabelListState,
  initial?: T,
) {
  if (!Is.plainObject(input)) throw new Error('Not an object');
  const item = PatchState.Is.state(input) ? input.current : input;
  const res = (item.data ?? { ...initial } ?? {}) as T;
  if (Patch.isProxy(item) && !item.data) item.data = res;
  return res;
}
