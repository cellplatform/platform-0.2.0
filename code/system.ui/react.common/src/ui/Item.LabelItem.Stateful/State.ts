import { commands } from './State.Commands';
import { events } from './State.Events';
import { DEFAULTS, Patch, PatchState, type t } from './common';

/**
 * Safe/immutable/observable memory state [Model]'s.
 */
export const State = {
  commands,

  /**
   * An observable list state.
   */
  list(): t.LabelItemListState {
    const initial = DEFAULTS.data.list;
    return PatchState.init<t.LabelItemList>({ initial });
  },

  /**
   * An obvservable list item.
   */
  item(
    initial = DEFAULTS.data.item,
    options: { onChange?: t.PatchChangeHandler<t.LabelItem> } = {},
  ): t.LabelItemState {
    const { onChange } = options;
    return PatchState.init<t.LabelItem, t.LabelItemStateEvents>({
      initial,
      events,
      onChange,
    });
  },

  /**
   * Ensures the {data} object exists on the given draft/proxy object.
   */
  data<T extends O>(input: t.LabelItem, defaultValue?: T): T {
    if (!Patch.isProxy(input)) throw new Error('Input not an immutable proxy');
    input.data = defaultValue ?? {};
    return input.data as T;
  },
} as const;
