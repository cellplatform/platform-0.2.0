import { commands } from './Model.Item.commands';
import { events } from './Model.Item.events';
import { DEFAULTS, Is, Patch, PatchState, type t } from './common';

type O = Record<string, unknown>;

/**
 * Safe/immutable/observable memory state [Model]'s.
 */
export const Model = {
  commands,

  /**
   * An observable list state.
   */
  list<D extends O = O>(): t.LabelListState {
    const initial = DEFAULTS.data.list as t.LabeList<D>;
    return PatchState.init<t.LabeList<D>>({ initial });
  },

  /**
   * An obvservable list item.
   */
  item<A extends t.LabelItemActionKind = string, D extends O = O>(
    initial: t.LabelItem<A, D> = DEFAULTS.data.item as t.LabelItem<A, D>,
    options: { onChange?: t.PatchChangeHandler<t.LabelItem<A, D>> } = {},
  ): t.LabelItemState<A, D> {
    const { onChange } = options;
    return PatchState.init<t.LabelItem<A, D>, t.LabelItemStateEvents<A, D>>({
      initial,
      events,
      onChange,
    });
  },

  /**
   * Ensures the {data} object exists on the given draft/proxy object.
   */
  data<T extends O>(
    input: t.LabelItem | t.LabelItemState | t.LabeList | t.LabelListState,
    initial?: T,
  ): T {
    if (!Is.plainObject(input)) throw new Error('Not an object');
    const item = PatchState.is.state(input) ? input.current : input;
    const res = (item.data ?? { ...initial } ?? {}) as T;
    if (Patch.isProxy(item) && !item.data) item.data = res;
    return res;
  },
} as const;
