import { command } from './State.Command';
import { events } from './State.Events';
import { DEFAULTS, PatchState, type t } from './common';

/**
 * Safe/immutable/observable memory state [Model]'s.
 */
export const State = {
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
   * Issue a command against the item.
   */
  command,
} as const;
