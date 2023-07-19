import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, type t } from './common';
import { useItemEditController } from './useItem.EditController.mjs';
import { useItemSelectionController } from './useItem.SelectionController.mjs';

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

  const selectionController = useItemSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection'),
    ctx,
    item,
    onChange,
    handlers: {}, // NB: passed in from prior controller (if there was one).
  });

  const editController = useItemEditController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Edit'),
    ctx,
    item,
    onChange,
    handlers: selectionController.handlers,
  });

  /**
   * API
   */
  const api: t.LabelItemActionController = {
    enabled,
    handlers: editController.handlers,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
