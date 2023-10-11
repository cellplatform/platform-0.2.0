import { commands } from './State.Commands';
import { events } from './State.Events';
import { DEFAULTS, Patch, PatchState, type t, Is } from './common';

type O = Record<string, unknown>;

/**
 * Safe/immutable/observable memory state [Model]'s.
 */
export const State = {
  commands,

  /**
   * An observable list state.
   */
  list(): t.LabelListState {
    const initial = DEFAULTS.data.list;
    return PatchState.init<t.LabeList>({ initial });
  },

  /**
   * An obvservable list item.
   */
  item<A extends t.LabelActionKind = string>(
    initial: t.LabelItem<A> = DEFAULTS.data.item as t.LabelItem<A>,
    options: { onChange?: t.PatchChangeHandler<t.LabelItem> } = {},
  ): t.LabelItemState<A> {
    const { onChange } = options;
    return PatchState.init<t.LabelItem<A>, t.LabelItemStateEvents<A>>({
      initial,
      events,
      onChange,
    });
  },

  /**
   * Ensures the {data} object exists on the given draft/proxy object.
   */
  data<T extends O>(input: t.LabelItem | t.LabelItemState, initial?: T): T {
    if (!Is.plainObject(input)) throw new Error('Not an object');
    const item = PatchState.is.state(input) ? input.current : input;
    const res = (item.data ?? { ...initial } ?? {}) as T;
    if (Patch.isProxy(item) && !item.data) item.data = res;
    return res;
  },
} as const;
