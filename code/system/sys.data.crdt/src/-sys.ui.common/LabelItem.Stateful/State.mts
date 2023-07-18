import { DEFAULTS, PatchState, type t } from './common';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useController } from './useController.mjs';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

type Options = {
  initial?: t.LabelItem;
  onChange?: t.PatchChangeHandler<t.LabelItem>;
};

/**
 * Simple safe/immutable memory state for a single item.
 */
export const State = {
  DEFAULTS,
  BehaviorSelector,
  useController,
  useEditController,
  useSelectionController,

  ctx(): t.LabelItemListCtxState {
    const initial: t.LabelItemListCtx = {};
    return PatchState.init<t.LabelItemListCtx>({ initial });
  },

  item(initial = DEFAULTS.data, options: Options = {}): t.LabelItemState {
    const { onChange } = options;
    return PatchState.init<t.LabelItem>({ initial, onChange });
  },
} as const;
