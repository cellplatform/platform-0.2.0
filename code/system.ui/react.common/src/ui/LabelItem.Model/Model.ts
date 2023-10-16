import { Item } from './Item';
import { List } from './List';
import { Is, Patch, PatchState, type t } from './common';

type O = Record<string, unknown>;

/**
 * Safe/immutable/observable in-memory state.
 */
export const Model = {
  Item,
  List,

  /**
   * Ensures the {data} object exists on the given draft/proxy object.
   */
  data<T extends O>(
    input: t.LabelItem | t.LabelItemState | t.LabelList | t.LabelListState,
    initial?: T,
  ): T {
    if (!Is.plainObject(input)) throw new Error('Not an object');
    const item = PatchState.Is.state(input) ? input.current : input;
    const res = (item.data ?? { ...initial } ?? {}) as T;
    if (Patch.isProxy(item) && !item.data) item.data = res;
    return res;
  },
} as const;
