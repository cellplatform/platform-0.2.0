import { DEFAULTS, PatchState, type t } from './common';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useController } from './useController.mjs';
import { useItemEditController } from './useItem.EditController.mjs';
import { useItemSelectionController } from './useItem.SelectionController.mjs';

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
  useItemEditController,
  useItemSelectionController,

  ctx(): t.LabelItemListCtxState {
    const initial: t.LabelItemListCtx = {};
    return PatchState.init<t.LabelItemListCtx>({ initial });
  },

  item(initial = DEFAULTS.data, options: Options = {}): t.LabelItemState {
    const { onChange } = options;
    return PatchState.init<t.LabelItem>({ initial, onChange });
  },
} as const;
