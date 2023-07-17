import { DEFAULTS, PatchState, type t } from './common';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';
import { BehaviorSelector } from './ui.BehaviorSelector';

type Options = {
  initial?: t.LabelItemData;
  onChange?: t.PatchChangeHandler<t.LabelItemData>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const State = {
  DEFAULTS,
  BehaviorSelector,
  useEditController,
  useSelectionController,

  init(options: Options = {}): t.LabelItemState {
    const { onChange, initial = DEFAULTS.data } = options;
    return PatchState.init<t.LabelItemData>({ initial, onChange });
  },
} as const;
