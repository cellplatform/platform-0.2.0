import { DEFAULTS, PatchState, type t } from './common';

type Options = {
  initial?: t.LabelItemData;
  onChange?: t.PatchChangeHandler<t.LabelItemData>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const StateObject = {
  init(options: Options = {}): t.LabelItemState {
    const { initial = DEFAULTS.data, onChange } = options;
    return PatchState.init<t.LabelItemData>({ initial, onChange });
  },
};
