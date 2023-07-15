import { DEFAULTS, PatchState, type t } from './common';

type Options = {
  initial?: t.LabelItemData;
  onChange?: t.PatchChangeHandler<t.LabelItemData>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const State = {
  init(options: Options = {}): t.LabelItemState {
    const { onChange, initial = DEFAULTS.data } = options;
    return PatchState.init<t.LabelItemData>({ initial, onChange });
  },
};
