import { DEFAULTS, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

import { useItemEditController } from './use.Item.EditController.mjs';
import { useItemSelectionController } from './use.Item.SelectionController.mjs';

type Args = {
  useBehaviors?: t.LabelItemBehaviorKind[];
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
  item?: t.LabelItemState;
  handlers?: t.LabelItemPropsHandlers;
  onChange?: t.LabelItemStateChangeHandler;
};

/**
 * HOOK: roll-up of all controllers related to a <Item>.
 */
export function useItemController(args: Args) {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = args;
  const enabled =
    (args.enabled ?? true) && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection', 'Item.Edit');

  const itemSelection = useItemSelectionController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Selection'),
    ctx,
    item,
    onChange,
    handlers: {}, // NB: passed in from prior controller (if there was one).
  });

  const itemEdit = useItemEditController({
    enabled: enabled && Wrangle.isUsing(useBehaviors, 'Item', 'Item.Edit'),
    ctx,
    item,
    onChange,
    handlers: itemSelection.handlers,
  });

  /**
   * API
   */
  const api: t.LabelItemController<'controller:Item'> = {
    kind: 'controller:Item',
    enabled,
    handlers: itemEdit.handlers,
    get data() {
      return item?.current ?? DEFAULTS.data;
    },
  };

  return api;
}
