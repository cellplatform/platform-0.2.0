import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, type t } from './common';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

type Args = {
  useBehaviors?: t.LabelItemBehaviorKind[];
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: roll-up of all controllers related to a <LabelItem>.
 */
export function useController(args: Args) {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    args.enabled ?? (true && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection', 'Item.Edit'));

  const selectionController = useSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection'),
    ctx,
    item,
    onChange,
    handlers: {}, // NB: passed in from prior controller (if there was one).
  });

  const editController = useEditController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Edit'),
    ctx,
    item,
    onChange,
    handlers: selectionController.handlers,
  });

  /**
   * API
   */
  const api: t.LabelActionController = {
    enabled,
    handlers: editController.handlers,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
