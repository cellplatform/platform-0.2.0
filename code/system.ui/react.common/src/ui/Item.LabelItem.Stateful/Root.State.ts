import { DEFAULTS, PatchState, type t } from './common';

type Options = {
  initial?: t.LabelItem;
  onChange?: t.PatchChangeHandler<t.LabelItem>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const State = {
  DEFAULTS,

  list(): t.LabelItemListState {
    const initial: t.LabelItemList = {};
    return PatchState.init<t.LabelItemList>({ initial });
  },

  item(initial = DEFAULTS.data, options: Options = {}): t.LabelItemState {
    const { onChange } = options;
    return PatchState.init<t.LabelItem>({ initial, onChange });
  },
} as const;
